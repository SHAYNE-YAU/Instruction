
function main(config, profileName) {
  if (!config || typeof config !== "object") return config;

  const customRules = [
    // GitHub
    "DOMAIN-SUFFIX,github.com,NCloud",
    "DOMAIN-SUFFIX,githubusercontent.com,NCloud",
    "DOMAIN-SUFFIX,githubassets.com,NCloud",

    // OpenAI
    "DOMAIN-SUFFIX,chatgpt.com,NCloud",
    "DOMAIN-SUFFIX,openai.com,NCloud",
    "DOMAIN-SUFFIX,oaiusercontent.com,NCloud",
    "DOMAIN-SUFFIX,oaistatic.com,NCloud",

    // Gemini
    "DOMAIN-SUFFIX,gemini.google.com,NCloud",
    "DOMAIN-SUFFIX,aistudio.google.com,NCloud",

    // Microsoft
    "DOMAIN-SUFFIX,login.live.com,DIRECT",
    "DOMAIN-SUFFIX,login.microsoftonline.com,DIRECT",
    "DOMAIN-SUFFIX,store.microsoft.com,DIRECT",

    // Zeal
    "DOMAIN-SUFFIX,zealdocs.org,NCloud",
    "DOMAIN-SUFFIX,kapeli.com,NCloud",

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
    "PROCESS-NAME,Telegram.exe,NCloud",

    // Telegram - macOS
    "PROCESS-NAME,Telegram,NCloud",

    "DOMAIN-SUFFIX,telegram.org,NCloud",
    "DOMAIN-SUFFIX,telegram.me,NCloud",
    "DOMAIN-SUFFIX,t.me,NCloud",
    "DOMAIN-SUFFIX,telegra.ph,NCloud",
    "DOMAIN-SUFFIX,tdesktop.com,NCloud",

    // Telegram IP ranges
    "IP-CIDR,91.108.56.0/22,NCloud,no-resolve",
    "IP-CIDR,91.108.4.0/22,NCloud,no-resolve",
    "IP-CIDR,91.108.8.0/22,NCloud,no-resolve",
    "IP-CIDR,91.108.16.0/22,NCloud,no-resolve",
    "IP-CIDR,91.108.12.0/22,NCloud,no-resolve",
    "IP-CIDR,149.154.160.0/20,NCloud,no-resolve",
    "IP-CIDR,91.105.192.0/23,NCloud,no-resolve",
    "IP-CIDR,91.108.20.0/22,NCloud,no-resolve",
    "IP-CIDR,185.76.151.0/24,NCloud,no-resolve",

    // Zhejiang University VPN
    "DOMAIN-SUFFIX,zju.edu.cn,DIRECT",
    "DOMAIN-SUFFIX,cc98.org,DIRECT",

    // Interactive Brokers
    "DOMAIN-SUFFIX,interactivebrokers.com,DIRECT"
  ];

  // Detect available proxy groups and nodes.
  const groupNames = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
        .filter(group => group && typeof group.name === "string")
        .map(group => group.name)
    : [];

  const proxyNames = Array.isArray(config.proxies)
    ? config.proxies
        .filter(proxy => proxy && typeof proxy.name === "string")
        .map(proxy => proxy.name)
    : [];

  const availableNames = new Set([
    ...groupNames,
    ...proxyNames
  ]);

  // Choose the proxy target for the active subscription.
  let proxyTarget = null;

  if (availableNames.has("NCloud")) {
    proxyTarget = "NCloud";
  } else if (availableNames.has("JMS")) {
    proxyTarget = "JMS";
  } else if (availableNames.has("JMS Auto")) {
    proxyTarget = "JMS Auto";
  }

  // Resolve NCloud placeholders dynamically.
  const resolvedRules = customRules.flatMap(rule => {
    if (!rule.includes(",NCloud")) {
      return [rule];
    }

    if (!proxyTarget) {
      return [];
    }

    return [
      rule.replace(
        /,NCloud(?=,|$)/g,
        `,${proxyTarget}`
      )
    ];
  });

  // Remove old versions of managed rules, including rules
  // that previously targeted another proxy group.
  const managedRuleKeys = new Set(
    customRules.map(rule =>
      rule.split(",").slice(0, 2).join(",")
    )
  );

  if (!Array.isArray(config.rules)) {
    config.rules = [];
  }

  config.rules = config.rules.filter(rule => {
    if (typeof rule !== "string") return true;

    const key = rule.split(",").slice(0, 2).join(",");
    return !managedRuleKeys.has(key);
  });

  // Custom rules take precedence.
  config.rules.unshift(...resolvedRules);

  // DNS: preserve the existing local listener configuration.
  if (!config.dns || typeof config.dns !== "object") {
    config.dns = {};
  }

  config.dns.enable = true;
  config.dns.listen = "127.0.0.1:53";

  // TUN: preserve the existing IPv4 /1 route workaround.
  if (!config.tun || typeof config.tun !== "object") {
    config.tun = {};
  }

  config.tun["auto-route"] = true;
  config.tun["auto-detect-interface"] = true;
  config.tun["route-address"] = [
    "0.0.0.0/1",
    "128.0.0.0/1"
  ];

  return config;
}
