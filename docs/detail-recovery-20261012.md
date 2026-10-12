# Conditional surface-warning recovery candidate

Base PR49/main9c5d7c70b73474d566d83fd94601cc28b554a2a7. Separate isolated branch; no deployment. User confirmed movement while seeing the retryable surface-detail warning. The screenshots described by parent may represent genuinely missing textures, so this patch does not hide pending jobs or claim complete artwork recovery.

Both successful retry and late-arriving-image recovery previously cleared the warning only when campusReady was true. On the initial guest route entryReady can be true while optional full-campus scenery remains unloaded. New pure predicate requires pending===0 and either campusReady or entryReady with no campusLoad. Genuine missing surface jobs retain warning/Retry. Initial or active full-campus geometry loading retains progress. Gameplay, saved state, asset URLs and loading policy are unchanged.

126 units/source checks pass. Three new regression tests cover canonical recovery, real missing jobs, initial geometry and active geometry loading. Actual failed-image/late-recovery browser check was not completed before the meeting; no complete-scenery or hosted-CI claim. This is reviewable separately from the measured intro-render warmup candidate.
