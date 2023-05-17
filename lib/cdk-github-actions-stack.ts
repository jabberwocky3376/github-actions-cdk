import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { env } from 'process';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 環境変数ファイル読込
const environment = env.NODE_ENV || 'development';
dotenv.config({ path: path.join(__dirname, `../env/.env.${environment}`) });

/**
 * コンフィグ用インターフェース定義
 */
export interface EnlWebapiConfig {
  /** ユーザーテーブル名 */
  USER_TABLE_NAME: string;
}

export class CdkGithubActionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const config: EnlWebapiConfig = {
      USER_TABLE_NAME: env.USER_TABLE_NAME ?? "",
    }

    // DynamoDB
    const userTable = new cdk.aws_dynamodb.Table(this, "UserTableForCdkGithubActions", {
      partitionKey: { name: "id", type: cdk.aws_dynamodb.AttributeType.STRING },
      tableName: config.USER_TABLE_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Lambda
    const handler = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "handler",
      {
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        entry: "src/lambda/handler.ts",
        environment: {
          USER_TABLE_NAME: config.USER_TABLE_NAME
        }
      }
    )
    // LambdaにDynamoDBのCRUD操作権限を付与
    handler.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: [
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        resources: ['*'],
      })
    );

    // APIGW
    const api = new cdk.aws_apigateway.RestApi(this, "Endpoint", {
      defaultCorsPreflightOptions: {
        allowOrigins: cdk.aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: cdk.aws_apigateway.Cors.ALL_METHODS,
        allowHeaders: cdk.aws_apigateway.Cors.DEFAULT_HEADERS,
      },
      deployOptions: {
        tracingEnabled: true,
        stageName: "api",
      },
    })
    api.root.addProxy({
      defaultIntegration: new cdk.aws_apigateway.LambdaIntegration(handler),
    })

  }
}
