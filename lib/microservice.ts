import { Construct } from "constructs";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface cbmicroservicesProps{
    productTableMS: ITable
}

export class Cbmicroservice extends Construct{
    public readonly productMicroservices: NodejsFunction;
    constructor(scope: Construct, id: string, props:cbmicroservicesProps){
        super(scope, id);
        const nodeJsFunctionProps: NodejsFunctionProps = { 
        bundling: {
            externalModules:[
            'aws-sdk'
            ]
        },
        environment:{
            PRIMARY_KEY: 'id',
            DYNAMODB_TABLE_NAME: props.productTableMS.tableName
        },
        runtime: Runtime.NODEJS_22_X
        }

        const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
        entry: join(__dirname, `/../src/product/index.js`),
        ...nodeJsFunctionProps, 
        }); 
        props.productTableMS.grantReadWriteData(productFunction);
        this.productMicroservices = productFunction;
    }
}