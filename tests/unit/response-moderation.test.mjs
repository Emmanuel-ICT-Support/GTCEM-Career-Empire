import { describe, expect, test } from "vitest";
import { loadBrowserScript } from "./browser-script-loader.mjs";

function loadResponseModeration() {
  const windowObj = loadBrowserScript("src/services/response-moderation.js");
  return windowObj.CareerEmpireResponseModeration;
}

function createSupabaseMock({ existingReview = null } = {}) {
  const calls = {
    from: [],
    eq: [],
    upsert: []
  };

  const builder = {
    select() {
      return this;
    },
    eq(key, value) {
      calls.eq.push([key, value]);
      return this;
    },
    limit() {
      return this;
    },
    upsert(row, options) {
      calls.upsert.push({ row, options });
      return {
        select() {
          return this;
        },
        async maybeSingle() {
          return { data: { id: "new-review" }, error: null };
        }
      };
    },
    async maybeSingle() {
      return { data: existingReview, error: null };
    }
  };

  return {
    calls,
    from(table) {
      calls.from.push(table);
      return { ...builder };
    }
  };
}

describe("CareerEmpireResponseModeration", () => {
  test("flags likely privacy and publishing risks in student text", () => {
    const moderation = loadResponseModeration();

    const result = moderation.flagResponseText(
      "Mia wrote about my school, my shift at Kmart in Cockburn, and emailed mia@example.com.",
      { student: { displayName: "Mia Smith" } }
    );

    expect(result.flags).toEqual(expect.arrayContaining([
      "possible_email",
      "possible_student_name",
      "possible_context_identifier",
      "possible_workplace_identifier",
      "possible_location"
    ]));
    expect(result.flagNotes).toContain("email address");
  });

  test("accepts only meaningful reviewable evidence", () => {
    const moderation = loadResponseModeration();

    expect(moderation.isReviewableEvidence(
      "est-response",
      "I would use initiative by starting the task, checking priorities, and asking for feedback."
    )).toBe(true);
    expect(moderation.isReviewableEvidence("est-response", "No response entered.")).toBe(false);
    expect(moderation.isReviewableEvidence("core-score", "Question 1 / 5 selected answer")).toBe(false);
    expect(moderation.isReviewableEvidence("employability-star", "Helped team plan")).toBe(true);
  });

  test("queues a pending review row with flags and duplicate checks", async () => {
    const moderation = loadResponseModeration();
    const supabase = createSupabaseMock();

    const result = await moderation.queuePendingReview(supabase, {
      studentId: "student-1",
      classId: "class-1",
      schoolId: "school-1",
      moduleId: "est-prep",
      evidenceType: "est-response",
      taskKey: "initiative-response",
      taskLabel: "Initiative response",
      promptText: "Explain initiative at work.",
      responseText: "I showed initiative by starting the task early and asking my manager for feedback.",
      student: { displayName: "Ava Lee" }
    });

    expect(result).toEqual({ id: "new-review" });
    expect(supabase.calls.from).toEqual([
      "student_response_reviews",
      "student_response_reviews"
    ]);
    expect(supabase.calls.upsert).toHaveLength(1);
    expect(supabase.calls.upsert[0].row).toMatchObject({
      student_id: "student-1",
      class_id: "class-1",
      school_id: "school-1",
      module_id: "est-prep",
      evidence_type: "est-response",
      task_key: "initiative-response",
      status: "pending_review"
    });
    expect(supabase.calls.upsert[0].options).toEqual({ onConflict: "source_evidence_id" });
  });

  test("does not queue duplicate or excluded responses", async () => {
    const moderation = loadResponseModeration();
    const duplicateSupabase = createSupabaseMock({ existingReview: { id: "existing-review" } });

    const duplicate = await moderation.queuePendingReview(duplicateSupabase, {
      studentId: "student-1",
      classId: "class-1",
      schoolId: "school-1",
      moduleId: "est-prep",
      evidenceType: "est-response",
      taskKey: "same-response",
      responseText: "I used initiative by starting early, checking the steps, and asking for feedback."
    });

    expect(duplicate).toEqual({ id: "existing-review" });
    expect(duplicateSupabase.calls.upsert).toHaveLength(0);

    const excludedSupabase = createSupabaseMock();
    const excluded = await moderation.queuePendingReview(excludedSupabase, {
      studentId: "student-1",
      classId: "class-1",
      schoolId: "school-1",
      moduleId: "est-prep",
      evidenceType: "est-response",
      responseText: "I used initiative by starting early, checking the steps, and asking for feedback.",
      excludedResponseTexts: [
        "I used initiative by starting early, checking the steps, and asking for feedback."
      ]
    });

    expect(excluded).toBeNull();
    expect(excludedSupabase.calls.from).toHaveLength(0);
  });
});
