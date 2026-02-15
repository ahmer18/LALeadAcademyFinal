import { Helmet } from "react-helmet";

export default function HeadTag({ title = "LA Lead Academy | Learning Platform" }) {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content="LA Lead Academy - Your Path to Success | Learning Platform" />
    </Helmet>
  );
}
