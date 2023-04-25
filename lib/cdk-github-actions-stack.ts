import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdkGithubActionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数
    const hello = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "ramenGuFn",
      {
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        entry: "src/lambda/hello.ts",
      }
    )

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
      defaultIntegration: new cdk.aws_apigateway.LambdaIntegration(hello),
    })

    // const hello = new lambda.Function(this, 'HelloHandler', {
    //   runtime: lambda.Runtime.NODEJS_14_X,
    //   code: lambda.Code.fromAsset('src/'),
    //   handler: 'lambda/hello.handler'
    // })

    // new apigw.LambdaRestApi(this, 'Endpoint', {
    //   handler: hello,
    //   endpointTypes: [apigw.EndpointType.EDGE]
    // })

    // example resource
    // const queue = new sqs.Queue(this, 'CdkGithubActionsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
