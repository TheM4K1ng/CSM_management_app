export type ServiceNode = {
  id: number;
  name: string;
  type:
    | "postgres"
    | "mongo"
    | "kafka"
    | "nifi"
    | "airflow"
    | "sso"
    | "redis"
    | "other";
  systemId: number;
};
