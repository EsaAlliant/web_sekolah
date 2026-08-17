import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// "next/core-web-vitals" ini yang narik eslint-config-next secara penuh
// (termasuk eslint-plugin-react-hooks, eslint-plugin-react, jsx-a11y, dst),
// bukan cuma rule dari @next/eslint-plugin-next kayak config sebelumnya.
// "next/typescript" nambahin rule khusus TypeScript dari eslint-config-next.
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/**", "node_modules/**", "out/**", "build/**", "next-env.d.ts"] },
];

export default eslintConfig;
