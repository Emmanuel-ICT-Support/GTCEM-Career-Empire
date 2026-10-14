(function attachCareerEmpireSupabase(windowObj) {
  const globalConfig = windowObj.CAREER_EMPIRE_SUPABASE_CONFIG;

  async function loadSupabaseLibrary() {
    if (windowObj.supabase && typeof windowObj.supabase.createClient === "function") {
      return windowObj.supabase;
    }

    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return windowObj.supabase;
  }

  async function createSupabaseClient() {
    if (!globalConfig || !globalConfig.url || !globalConfig.anonKey) {
      throw new Error("Supabase config is missing. Copy config/supabase-config.example.js to a real config file and add your project URL and anon key.");
    }

    const supabaseLib = await loadSupabaseLibrary();
    return supabaseLib.createClient(globalConfig.url, globalConfig.anonKey);
  }

  windowObj.CareerEmpireSupabase = {
    async getClient() {
      if (!this._client) {
        this._client = await createSupabaseClient();
      }
      return this._client;
    }
  };
})(window);
