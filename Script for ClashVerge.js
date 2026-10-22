// Clash Verge Rev - Global Extension
// Compatible with NCloud and Just My Socks (JMS).
//
// NCloud: use original custom AI rules.
// JMS: use remote AI rule set with local supplements.
//
// Custom rules take precedence.
// Subscription rules are preserved.
// Device-specific DNS and TUN settings are not overwritten.

function main(config, profileName) {
  if (!config || typeof config !== "object") {
    return config;
  }

  // ==========================================
  // 1. Detect NCloud or JMS
  // ==========================================

  const groupNames = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
        .filter(group => group && typeof group.name === "string")
        .map(group => group.name)
    : [];

  const hasNCloud = groupNames.includes("NCloud");
  const hasJMS = groupNames.includes("JMS");

  let mode = null;

  if (hasJMS && !hasNCloud) {
    mode = "JMS";
  } else if (hasNCloud && !hasJMS) {
    mode = "NCloud";
  } else if (hasJMS && hasNCloud) {
    // If both are present, use the subscription profile name.
    const name = String(profileName || "").toLowerCase();

    if (name.includes("jms") || name.includes("just my socks")) {
      mode = "JMS";
    } else if (name.includes("ncloud")) {
      mode = "NCloud";
    }
  }

  // Do not modify an unidentified or ambiguous profile.
  if (!mode) {
    return config;
  }

  const PROXY_TARGET = mode;

  // ==========================================
  // 2. Common custom rules
  // ==========================================

  // PROXY_TARGET is a placeholder.
  // It will be replaced with NCloud or JMS.

  const commonRules = [

    // Bing
    "DOMAIN-SUFFIX,bing.com,DIRECT",
    "DOMAIN-SUFFIX,bing.net,DIRECT",

    // GitHub
    "DOMAIN-SUFFIX,github.com,PROXY_TARGET",
    "DOMAIN-SUFFIX,githubusercontent.com,PROXY_TARGET",
    "DOMAIN-SUFFIX,githubassets.com,PROXY_TARGET",

    // Microsoft
    "DOMAIN-SUFFIX,login.live.com,DIRECT",
    "DOMAIN-SUFFIX,login.microsoftonline.com,DIRECT",
    "DOMAIN-SUFFIX,store.microsoft.com,DIRECT",

    // Zeal
    "DOMAIN-SUFFIX,zealdocs.org,PROXY_TARGET",
    "DOMAIN-SUFFIX,kapeli.com,PROXY_TARGET",

    // HSBC Hong Kong
    "DOMAIN-SUFFIX,hsbc.com.hk,DIRECT",

    // BOCHK
    "DOMAIN-SUFFIX,bochk.com,DIRECT",

    // JD
    "DOMAIN-SUFFIX,jd.com,DIRECT",
    "DOMAIN-SUFFIX,jd.hk,DIRECT",
    "DOMAIN-SUFFIX,360buy.com,DIRECT",

    // Taobao
    "DOMAIN-SUFFIX,taobao.com,DIRECT",
    "DOMAIN-SUFFIX,tmall.com,DIRECT",

    // Alipay
    "DOMAIN-SUFFIX,alipay.com,DIRECT",
    "DOMAIN-SUFFIX,alipayobjects.com,DIRECT",

    // Tencent
    "DOMAIN-SUFFIX,tencent.com,DIRECT",
    "DOMAIN-SUFFIX,qq.com,DIRECT",
    "DOMAIN-SUFFIX,gtimg.com,DIRECT",

    // Bilibili
    "DOMAIN-SUFFIX,bilibili.com,DIRECT",
    "DOMAIN-SUFFIX,bilibili.tv,DIRECT",
    "DOMAIN-SUFFIX,bilivideo.com,DIRECT",
    "DOMAIN-SUFFIX,bilivideo.cn,DIRECT",
    "DOMAIN-SUFFIX,hdslb.com,DIRECT",
    "DOMAIN-SUFFIX,biliapi.net,DIRECT",

    // pip / Conda domestic mirrors
    "DOMAIN,pypi.tuna.tsinghua.edu.cn,DIRECT",
    "DOMAIN,mirrors.tuna.tsinghua.edu.cn,DIRECT",

    // Nature / Springer Nature
    "DOMAIN-SUFFIX,nature.com,DIRECT",
    "DOMAIN-SUFFIX,springernature.com,DIRECT",
    "DOMAIN-SUFFIX,springer.com,DIRECT",

    // Science / AAAS
    "DOMAIN-SUFFIX,science.org,DIRECT",
    "DOMAIN-SUFFIX,aaas.org,DIRECT",
    "DOMAIN-SUFFIX,sciencemag.org,DIRECT",

    // ACS
    "DOMAIN-SUFFIX,acs.org,DIRECT",

    // Wiley
    "DOMAIN-SUFFIX,wiley.com,DIRECT",
    "DOMAIN-SUFFIX,onlinelibrary.wiley.com,DIRECT",

    // APS / Physical Review
    "DOMAIN-SUFFIX,aps.org,DIRECT",
    "DOMAIN-SUFFIX,journals.aps.org,DIRECT",

    // Elsevier / ScienceDirect / Cell
    "DOMAIN-SUFFIX,elsevier.com,DIRECT",
    "DOMAIN-SUFFIX,sciencedirect.com,DIRECT",
    "DOMAIN-SUFFIX,cell.com,DIRECT",

    // Oxford Academic
    "DOMAIN-SUFFIX,oup.com,DIRECT",
    "DOMAIN-SUFFIX,academic.oup.com,DIRECT",

    // Cambridge University Press
    "DOMAIN-SUFFIX,cambridge.org,DIRECT",

    // Wise
    "DOMAIN-SUFFIX,wise.com,DIRECT",

    // Telegram - Windows
    "PROCESS-NAME,Telegram.exe,PROXY_TARGET",

    // Telegram - macOS
    "PROCESS-NAME,Telegram,PROXY_TARGET",

    // Telegram domains
    "DOMAIN-SUFFIX,telegram.org,PROXY_TARGET",
    "DOMAIN-SUFFIX,telegram.me,PROXY_TARGET",
    "DOMAIN-SUFFIX,t.me,PROXY_TARGET",
    "DOMAIN-SUFFIX,telegra.ph,PROXY_TARGET",
    "DOMAIN-SUFFIX,tdesktop.com,PROXY_TARGET",

    // Telegram IP ranges
    "IP-CIDR,91.108.56.0/22,PROXY_TARGET,no-resolve",
    "IP-CIDR,91.108.4.0/22,PROXY_TARGET,no-resolve",
    "IP-CIDR,91.108.8.0/22,PROXY_TARGET,no-resolve",
    "IP-CIDR,91.108.16.0/22,PROXY_TARGET,no-resolve",
    "IP-CIDR,91.108.12.0/22,PROXY_TARGET,no-resolve",
    "IP-CIDR,149.154.160.0/20,PROXY_TARGET,no-resolve",
    "IP-CIDR,91.105.192.0/23,PROXY_TARGET,no-resolve",
    "IP-CIDR,91.108.20.0/22,PROXY_TARGET,no-resolve",
    "IP-CIDR,185.76.151.0/24,PROXY_TARGET,no-resolve",

    // Zhejiang University VPN
    "DOMAIN-SUFFIX,zju.edu.cn,DIRECT",
    "DOMAIN-SUFFIX,cc98.org,DIRECT",

    // Interactive Brokers
    "DOMAIN-SUFFIX,interactivebrokers.com,DIRECT"
  ];

  // ==========================================
  // 3. NCloud AI rules
  // ==========================================

  const ncloudAIRules = [
    // OpenAI / ChatGPT
    "DOMAIN-SUFFIX,chatgpt.com,PROXY_TARGET",
    "DOMAIN-SUFFIX,openai.com,PROXY_TARGET",
    "DOMAIN-SUFFIX,oaiusercontent.com,PROXY_TARGET",
    "DOMAIN-SUFFIX,oaistatic.com,PROXY_TARGET",

    // Google AI
    "DOMAIN-SUFFIX,gemini.google.com,PROXY_TARGET",
    "DOMAIN-SUFFIX,aistudio.google.com,PROXY_TARGET"
  ];

  // ==========================================
  // 4. JMS AI supplementary rules
  // ==========================================

  // The external JMS AI rules do not explicitly
  // include every domain from the original rules.
  // Keep a minimal supplementary list.

  const jmsAISupplementRules = [
    "DOMAIN-SUFFIX,aistudio.google.com,PROXY_TARGET"
  ];

  // ==========================================
  // 5. Configure the remote JMS AI rule provider
  // ==========================================

  const jmsProviderName = "jms-ai-services";

  if (mode === "JMS") {
    if (
      !config["rule-providers"] ||
      typeof config["rule-providers"] !== "object" ||
      Array.isArray(config["rule-providers"])
    ) {
      config["rule-providers"] = {};
    }

    config["rule-providers"][jmsProviderName] = {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/justmysocks-guide/clash-rules/main/rules/ai-services.yaml",
      path: "./ruleset/jms-ai-services.yaml",
      interval: 86400
    };
  }

  // ==========================================
  // 6. Build rules for the active subscription
  // ==========================================

  // Common rules always apply.
  const selectedRules = [...commonRules];

  if (mode === "NCloud") {
    // Use manually maintained AI rules.
    selectedRules.push(...ncloudAIRules);
  }

  if (mode === "JMS") {
    // Add only the AI domains missing from
    // the external JMS rule provider.
    selectedRules.push(...jmsAISupplementRules);

    // Main AI matching comes from the remote rule set.
    selectedRules.push(
      `RULE-SET,${jmsProviderName},PROXY_TARGET`
    );
  }

  // Replace only the proxy target placeholder.
  const resolvedRules = selectedRules.map(rule =>
    rule.replace(
      /PROXY_TARGET/g,
      PROXY_TARGET
    )
  );

  // ==========================================
  // 7. Merge rules without deleting original rules
  // ==========================================

  if (!Array.isArray(config.rules)) {
    config.rules = [];
  }

  // Preserve existing subscription rules in their
  // original relative order.
  //
  // Identical rules are not inserted twice.
  // Rules with the same domain but different actions
  // remain intact in the subscription.

  const existingRules = config.rules;
  const existingRuleSet = new Set(existingRules);

  const rulesToPrepend = resolvedRules.filter(
    rule => !existingRuleSet.has(rule)
  );

  config.rules = [
    ...rulesToPrepend,
    ...existingRules
  ];


  // ==========================================
  // 8. DEVICE-SPECIFIC DNS / TUN SETTINGS
  // ==========================================
  //
  // ★★★★★ DEVICE SWITCH ★★★★★
  //
  // Home Windows desktop: true
  // Office Windows PC:    false
  // MacBook:              false
  //
  // Change ONLY the value below.
  // ==========================================

  const ENABLE_HOME_WINDOWS_FIX = false;

  // ==========================================
  // BEGIN: HOME WINDOWS ONLY
  // Do not change the tested settings below.
  // ==========================================

  if (ENABLE_HOME_WINDOWS_FIX) {

    // DNS: local Mihomo DNS listener
    if (!config.dns || typeof config.dns !== "object") {
      config.dns = {};
    }

    config.dns.enable = true;
    config.dns.listen = "127.0.0.1:53";

    // TUN: tested IPv4 /1 routing workaround
    if (!config.tun || typeof config.tun !== "object") {
      config.tun = {};
    }

    config.tun["auto-route"] = true;
    config.tun["auto-detect-interface"] = true;
    config.tun["route-address"] = [
      "0.0.0.0/1",
      "128.0.0.0/1"
    ];

  }

  // ==========================================
  // END: HOME WINDOWS ONLY
  // ==========================================

  return config;
}
