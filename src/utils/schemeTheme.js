export const getSchemeTheme = (formType = "welfare") => {
  const isRkky = formType === "rkky";

  if (isRkky) {
    return {
      title: "Rayat Kutumb Kalyan Yojana",
      topbarBackground: "linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)",
      shellBackground:
        "radial-gradient(circle at top left, rgba(20,184,166,0.10), transparent 28%), linear-gradient(180deg, #f0fdfa 0%, #ecfeff 100%)",
      sidebarBackground: "linear-gradient(180deg, #f8fffe 0%, #effcf9 100%)",
      sidebarBorder: "rgba(15, 118, 110, 0.14)",
      hoverBackground: "rgba(15, 118, 110, 0.08)",
      softBackground: "#f0fdfa",
      softBorder: "#99f6e4",
      panelBorder: "#99f6e4",
      selectedBackground: "rgba(15, 118, 110, 0.14)",
      selectedHoverBackground: "rgba(15, 118, 110, 0.18)",
      primary: "#0f766e",
      primaryMuted: "rgba(15, 118, 110, 0.72)",
      menuHoverBackground: "rgba(15, 118, 110, 0.08)",
    };
  }

  return {
    title: "Rayat Welfare Form",
    topbarBackground: "linear-gradient(90deg, #1d4ed8 0%, #60a5fa 100%)",
    shellBackground:
      "radial-gradient(circle at top left, rgba(96,165,250,0.12), transparent 28%), linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%)",
    sidebarBackground: "linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%)",
    sidebarBorder: "rgba(29, 78, 216, 0.12)",
    hoverBackground: "rgba(29, 78, 216, 0.08)",
    softBackground: "#eff6ff",
    softBorder: "#bfdbfe",
    panelBorder: "#bfdbfe",
    selectedBackground: "rgba(29, 78, 216, 0.14)",
    selectedHoverBackground: "rgba(29, 78, 216, 0.18)",
    primary: "#1d4ed8",
    primaryMuted: "rgba(29, 78, 216, 0.72)",
    menuHoverBackground: "rgba(29, 78, 216, 0.08)",
  };
};
