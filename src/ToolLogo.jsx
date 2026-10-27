export function ToolLogo({ tool, base = "./", className = "", loading = "lazy" }) {
  const classes = `home-tool-logo ${className}`.trim();
  return tool.logo ? (
    <img className={classes} src={`${base}${tool.logo}`} alt=""
      width="44" height="44" loading={loading} decoding="async" />
  ) : (
    <span className={`${classes} home-tool-mark`} aria-hidden="true">{tool.mark}</span>
  );
}
