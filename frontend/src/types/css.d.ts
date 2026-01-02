// Type declarations for CSS imports
// This allows TypeScript to understand CSS file imports as side-effect modules

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "slick-carousel/slick/slick.css";
declare module "slick-carousel/slick/slick-theme.css";
