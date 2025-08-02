import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface CbapigatewayProps{
    productApi: IFunction;
}

export class Cbapigateway extends Construct{
    constructor(scope: Construct, id: string, props: CbapigatewayProps){
        super(scope, id)
        const apigw = new LambdaRestApi(this, 'ProductAPI', {
        handler: props.productApi,
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