import * as cdk from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsMicrosStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, 'Product', {
      partitionKey:{
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: "Product",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    const nodeJsFunctionProps: NodejsFunctionProps = { // here red underline "-"
      bundling: {
        externalModules:[
          'aws-sdk'
        ]
      },
      environment:{
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName
      },
      runtime: Runtime.NODEJS_22_X
    }

    const prouctFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJsFunctionProps, //here red underline
    }); 
    productTable.grantReadWriteData(prouctFunction);

    const apigw = new LambdaRestApi(this, 'ProductAPI', {
      handler: prouctFunction,
      proxy: false
    });

  const products = apigw.root.addResource('product');
  products.addMethod('GET');  
  products.addMethod('POST'); 

  const singleProduct = products.addResource('{id}');
  singleProduct.addMethod('GET');   
  singleProduct.addMethod('PUT'); 
  singleProduct.addMethod('DELETE');

  }
}
