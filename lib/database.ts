import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class Cbdatabase extends Construct{
    public readonly productTableAccess: ITable;
    constructor(scope: Construct, id: string){
        super(scope, id);
        const productTable = new Table(this, 'Product', {
              partitionKey:{
                name: 'id',
                type: AttributeType.STRING
              },
              tableName: "Product",
              removalPolicy: RemovalPolicy.DESTROY,
              billingMode: BillingMode.PAY_PER_REQUEST
            });
        this.productTableAccess = productTable;
    }


} 