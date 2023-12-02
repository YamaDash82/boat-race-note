
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "/app/server-side/src/schema.gql",
  //documents: "src/**/*.ts",
  generates: {
    "projects/main/src/generated/graphql.ts": {
      plugins: [
        "typescript", 
        "typescript-operations", 
        "typescript-apollo-angular"
      ]
    },
  }
};

export default config;
