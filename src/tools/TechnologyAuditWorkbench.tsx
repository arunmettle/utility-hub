import CompareAuditTool from '../components/CompareAuditTool';
import {
  analyzeApiContractDrift,
  analyzeCsvSchemaDrift,
  analyzeEnvSchemaDrift,
} from '../lib/workspaceWedgeTools';

const oldApiContract = `method,path,status,requestSchema,responseSchema,auth
GET,/v1/orders,200,OrderQuery,OrderList,bearer
POST,/v1/orders,201,CreateOrder,OrderRecord,bearer
GET,/v1/health,200,None,Health,None`;

const newApiContract = `method,path,status,requestSchema,responseSchema,auth
GET,/v1/orders,200,OrderQueryV2,OrderList,bearer
POST,/v1/orders,201,CreateOrder,OrderRecord,bearer
POST,/v1/orders/{id}/cancel,202,CancelOrder,CancelReceipt,bearer`;

export function ApiContractDriftChecker() {
  return (
    <CompareAuditTool
      eyebrow="Developer"
      title="API Contract Drift Checker"
      description="Compare two API contract tables locally and flag route additions, removals, auth drift, and schema changes before release."
      note={{
        title: 'Release wedge',
        body: 'This tool is meant for the narrow release-review moment where teams already have contract exports or hand-built tables and want a fast deterministic drift screen.',
      }}
      leftLabel="Contract A"
      rightLabel="Contract B"
      leftHint="Older route table"
      rightHint="Current route table"
      leftSample={oldApiContract}
      rightSample={newApiContract}
      analyze={analyzeApiContractDrift}
    />
  );
}

const oldCsv = `user_id,email,role,created_at
1,a@example.com,admin,2026-01-01
2,b@example.com,user,2026-01-02`;

const newCsv = `user_id,email,role,status,created_at
1,a@example.com,admin,active,2026-01-01
2,b@example.com,user,active,2026-01-02
3,c@example.com,user,active`;

export function CsvSchemaDriftChecker() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="CSV Schema Drift Checker"
      description="Compare two CSV payload samples and catch column drift, removed headers, and row-width issues before downstream jobs break."
      note={{
        title: 'Why this matters',
        body: 'Teams often catch CSV contract breakage too late because the file still “opens fine.” This tool makes schema drift visible immediately.',
      }}
      leftLabel="Old CSV"
      rightLabel="New CSV"
      leftHint="Previous export shape"
      rightHint="Current export shape"
      leftSample={oldCsv}
      rightSample={newCsv}
      analyze={analyzeCsvSchemaDrift}
    />
  );
}

const oldEnvSchema = `key,required,scope,defaultValue,notes
API_URL,true,server,,Base API endpoint
LOG_LEVEL,false,server,info,Application log level
FEATURE_ALPHA,false,client,false,Feature flag`;

const newEnvSchema = `key,required,scope,defaultValue,notes
API_URL,true,server,,Base API endpoint
LOG_LEVEL,true,server,warn,Application log level
FEATURE_ALPHA,false,client,true,Feature flag
JWT_AUDIENCE,true,server,,Required auth audience`;

export function EnvSchemaDriftChecker() {
  return (
    <CompareAuditTool
      eyebrow="Security"
      title="ENV Schema Drift Checker"
      description="Compare two environment-spec tables and surface changed required flags, scope shifts, and new mandatory variables before config drift spreads."
      note={{
        title: 'Config focus',
        body: 'This is for env documentation and release parity review, not for reading real secret values.',
      }}
      leftLabel="Previous env spec"
      rightLabel="Current env spec"
      leftHint="Older environment contract"
      rightHint="Current environment contract"
      leftSample={oldEnvSchema}
      rightSample={newEnvSchema}
      analyze={analyzeEnvSchemaDrift}
    />
  );
}
