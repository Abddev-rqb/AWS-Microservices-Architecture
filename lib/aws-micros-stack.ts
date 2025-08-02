import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Cbdatabase } from './database';
import { Cbmicroservice } from './microservice';
import { Cbapigateway } from './apigatwy';

export class AwsMicrosStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new Cbdatabase(this, 'Database');
    const microservices = new Cbmicroservice(this, 'Microservices',{
      productTableMS: database.productTableAccess
    });
    const apigateway = new Cbapigateway(this, 'Apigateway',{
      productApi: microservices.productMicroservices,
    });
  }
}
