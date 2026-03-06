using com.ltim.subcon.syncsubconorder as syncsubconorder from '../db/syncsubconorder';
@impl: './subconprocess-service.js'
@path: '/subconprocess'
service syncsubconprocess {
    entity POItem as projection on syncsubconorder.POItem;
    entity POHeader as projection on syncsubconorder.POHeader;
    entity SubconComponents as projection on syncsubconorder.SubconComponents;
    entity SubcontractorStoreLoc as projection on syncsubconorder.SubcontractorStoreLoc;
function readPurchaseOrderHeader(purchaseorderid:String)                                                                   returns String;
function updateStatusAtItem(PurchaseOrder:String,PurchaseOrderItem:String)                                                 returns String;

}
