import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigw } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdkGithubActionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('src/'),
      handler: 'lambda/hello.handler'
    })

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello,
      endpointTypes: [apigw.EndpointType.REGIONAL]
    })

    // example resource
    // const queue = new sqs.Queue(this, 'CdkGithubActionsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
