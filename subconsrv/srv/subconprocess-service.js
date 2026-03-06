const { entitySerializer } = require('@sap-cloud-sdk/odata-common');
const { any } = require('@sap-cloud-sdk/odata-v4');
const { cePurchaseorder0001, PurchaseOrder, PurchaseOrderItem } = require("../srv/generated/CE_PURCHASEORDER_0001");
const { purchaseOrderApi, purchaseOrderItemApi, purchaseOrderScheduleLineApi, poSubcontractingComponentApi, purchaseOrderAccountAssignmentApi } = cePurchaseorder0001();
const cds = require('@sap/cds');
const { update } = require('@sap/cds/libx/_runtime/hana/execute');
const sdkDest = { "destinationName": 'S68_API_STANDARD' };
const { SELECT, INSERT, UPDATE, DELETE, UPSERT } = cds.ql;
const { POHeader, POItem, SubconComponents } = cds.entities("com.ltim.subcon.syncsubconorder");
// Added for segregating Event based logs 
const messagingLog = cds.log('messaging-service');

module.exports = cds.service.impl(async function () {

    // Connect to the messaging service specified in package.json file
    // It will be used for receiving the events from S/4 HANA Cloud System
    const messaging = await cds.connect.to('messaging');

    // Receive Purchase Order Created Event 
    messaging.on("sap.s4.beh.purchaseorder.v1.PurchaseOrder.Created.v1", async (msg) => {
        const { PurchaseOrder } = msg.data;

        messagingLog.info('--> Event received: PurchaseOrder created (Purchase Order Number ="' + PurchaseOrder + '")');

        
        let purchaseorderdetail = await readAllDetails(PurchaseOrder);   //fetches values from S/4 HANA cloud
        if (purchaseorderdetail != undefined) {

            // await DELETE.from(POHeader).where({PurchaseOrder:{'=':PurchaseOrder}});
            // await DELETE.from(POItem).where({PurchaseOrder:{'=':PurchaseOrder}});
            // await DELETE.from(SubconComponents).where({PurchaseOrder:{'=':PurchaseOrder}});

            const { header, item, subcon } = purchaseorderdetail;

            // Triggers insert call only if subcon exists in received data and with at least 1 entry
            if (subcon && subcon.length > 0){
                await INSERT.into(SubconComponents).entries(subcon);    //inserts subconcomponents into the btp table
            }

            // Triggers insert call only if item exists in received data and with at least 1 entry
            if ( item && item.length > 0){
                await INSERT.into(POItem).entries(item);    //inserts items into the btp table
            }

            // Triggers insert call only if header exists in received data and with at least 1 entry
            if ( header && header.length > 0){
                await INSERT.into(POHeader).entries(header);     //inserts header into the btp table
            }
            messagingLog.info("INSERTED into BTP Tables - Purchase order header, item and subcon details");
        }
    });


    // Receive Purchase Order Changed Event 
    messaging.on("sap.s4.beh.purchaseorder.v1.PurchaseOrder.Changed.v1", async (msg) => {
        const { PurchaseOrder } = msg.data;
        messagingLog.info('--> Event received: PurchaseOrder changed ((Purchase Order Number ="' + PurchaseOrder + '")');

        let purchaseorderdetail = await readAllDetails(PurchaseOrder);    //fetches values from S/4 HANA cloud
        if (purchaseorderdetail != undefined) {

            // await DELETE.from(POHeader).where({PurchaseOrder:{'=':PurchaseOrder}});
            // await DELETE.from(POItem).where({PurchaseOrder:{'=':PurchaseOrder}});
            // await DELETE.from(SubconComponents).where({PurchaseOrder:{'=':PurchaseOrder}});
            
            const { header, item, subcon } = purchaseorderdetail;

            // Triggers upsert call only if subcon exists in received data and with at least 1 entry
            if (subcon && subcon.length > 0){
                await UPSERT.into(SubconComponents).entries(subcon);    //updates subconcomponents into btp table
            }

            // Triggers upsert call only if item exists in received data and with at least 1 entry
            if ( item && item.length > 0){
                await UPSERT.into(POItem).entries(item);         //updates items into btp table
            }

            // Triggers upsert call only if header exists in received data and with at least 1 entry
            if ( header && header.length > 0){
                await UPSERT.into(POHeader).entries(header);     //updates header into btp table
            }
            messagingLog.info("UPDATED into BTP Tables - Purchase order header, item and subcon details");
        }
    });

    //generic event when POST call is triggered for POHeader from UI
    this.on("CREATE", "POHeader", async (req) => {
        
        //Validation for req data
        if (req.data != undefined) {

            await DELETE.from(POHeader).where({PurchaseOrder:{'=':req.data.PurchaseOrder}});
            await DELETE.from(POItem).where({PurchaseOrder:{'=':req.data.PurchaseOrder}});
            await DELETE.from(SubconComponents).where({PurchaseOrder:{'=':req.data.PurchaseOrder}});

            let orderItem = req.data.To_PurchaseOrderItem;
            // Trigger insert call only if _PurchaseOrderItem exists in request data and with at least 1 entry
            if (orderItem && orderItem.length > 0) {
                await INSERT.into(POItem).entries(orderItem);   
            }

            // Trigger insert call only if _SubconComponents exists in request data and with at least 1 entry
            let subconComp = req.data.To_SubconComponents;
            if (subconComp && subconComp.length > 0) {
                await INSERT.into(SubconComponents).entries(subconComp);  
            }

            let poheader = req.data;
            await INSERT.into(POHeader).entries(poheader);   //inserts header into btp table

            return req.data;
        }
    });

    //Read call for updating the transferred quantity

    // this.on("UPDATE", "SubconComponents", async (req) => {
        
    //     //Validation for req data
    //     if (req.data != undefined) {

    //         // await DELETE.from(POHeader).where({PurchaseOrder:{'=':req.data.PurchaseOrder}});
    //         // await DELETE.from(POItem).where({PurchaseOrder:{'=':req.data.PurchaseOrder}});
    //         // await DELETE.from(SubconComponents).where({PurchaseOrder:{'=':req.data.PurchaseOrder}});

    //         let orderItem = req.data.To_PurchaseOrderItem;
    //         // Trigger insert call only if _PurchaseOrderItem exists in request data and with at least 1 entry
    //         if (orderItem && orderItem.length > 0) {
    //             await INSERT.into(POItem).entries(orderItem);   
    //         }

    //         // Trigger insert call only if _SubconComponents exists in request data and with at least 1 entry
    //         let subconComp = req.data.To_SubconComponents;
    //         if (subconComp && subconComp.length > 0) {
    //             await INSERT.into(SubconComponents).entries(subconComp);  
    //         }

    //         let poheader = req.data;
    //         await INSERT.into(POHeader).entries(poheader);   //inserts header into btp table

    //         return req.data;
    //     }
    // });

    this.on('readPurchaseOrderHeader', async (req) => {
        try {

            const purchaseorderid = req.data.purchaseorderid;

            var oResultPostData = await readAllDetails(purchaseorderid);
            // await DELETE.from(POHeader).where({PurchaseOrder:{'=':purchaseorderid}});
            // await DELETE.from(POItem).where({PurchaseOrder:{'=':purchaseorderid}});
            // await DELETE.from(SubconComponents).where({PurchaseOrder:{'=':purchaseorderid}});

            // if (oResultPostData != undefined){
            //     const {header, item, subcon} = oResultPostData;
            //     await INSERT.into(SubconComponents).entries(subcon);
            //     await INSERT.into(POItem).entries(item);
            //     await INSERT.into(POHeader).entries(header);

                // await UPSERT.into(SubconComponents).entries(subcon);
                // await UPSERT.into(POItem).entries(item);
                // await UPSERT.into(POHeader).entries(header);
            // }

            return oResultPostData;

        } catch (error) {
            console.log(error)
        }
    })

    this.on('updateStatusAtItem', async (req) => {
        try {

            var receivedPO = req.data.PurchaseOrder;
            var receivedPOItem = req.data.PurchaseOrderItem;

            let subconStatus = await SELECT.from(SubconComponents).where({PurchaseOrder: receivedPO, PurchaseOrderItem:receivedPOItem}).columns('PurchaseOrder','PurchaseOrderItem','ReservationItem','ScheduleLine','RecordType','Status_Subcon');
            
            var count = 0;
            var arr = [];
            var obj = {
                "Status_Item": ""
            }
            for(let i=0; i<subconStatus.length; i++){
                
                if(subconStatus[i].Status_Subcon === "Transferred"){
                    count++;
                }
                if(count==subconStatus.length){
                    obj.Status_Item = "In Process";
                    arr.push(obj);
                }
                if(count==0){
                    obj.Status_Item = "Initial";
                    arr.push(obj);
                }
                if(count>0 && count<subconStatus.length){
                    obj.Status_Item = "In Transit";
                    arr.push(obj);
                }
            }
            await UPDATE (POItem, {PurchaseOrder: receivedPO, PurchaseOrderItem:receivedPOItem}).with(obj);
            var returnvar = {PurchaseOrder: receivedPO, PurchaseOrderItem:receivedPOItem , message: "Item status updated successfully"};
            return returnvar;
            
        } catch (error) {
            console.log(error)
        }
    })

    //function to fetch header, item and subcon details from S/4 HANA cloud
    async function readAllDetails(req) {
        try {
            
            //fetching header and item from S/4 HANA cloud
            let headeranditem = await purchaseOrderApi.requestBuilder().getAll()
                .select(purchaseOrderApi.schema.PURCHASE_ORDER,
                    purchaseOrderApi.schema.PURCHASE_ORDER_TYPE,
                    purchaseOrderApi.schema.CREATED_BY_USER,
                    purchaseOrderApi.schema.CREATION_DATE,
                    purchaseOrderApi.schema.PURCHASE_ORDER_DATE,
                    purchaseOrderApi.schema.LAST_CHANGE_DATE_TIME,
                    purchaseOrderApi.schema.VALIDITY_START_DATE,
                    purchaseOrderApi.schema.VALIDITY_END_DATE,
                    purchaseOrderApi.schema.LANGUAGE,
                    purchaseOrderApi.schema.PURCHASE_ORDER_DELETION_CODE,
                    purchaseOrderApi.schema.RELEASE_CODE,
                    purchaseOrderApi.schema.COMPANY_CODE,
                    purchaseOrderApi.schema.PURCHASING_ORGANIZATION,
                    purchaseOrderApi.schema.PURCHASING_GROUP,
                    purchaseOrderApi.schema.SUPPLIER,
                    purchaseOrderApi.schema.SUPPLIER_ADDRESS_ID,
                    purchaseOrderApi.schema.SUPPLYING_PLANT,
                    purchaseOrderApi.schema.INVOICING_PARTY,
                    purchaseOrderApi.schema.PAYMENT_TERMS,
                    purchaseOrderApi.schema.CASH_DISCOUNT_1_DAYS,
                    purchaseOrderApi.schema.CASH_DISCOUNT_2_DAYS,
                    purchaseOrderApi.schema.NET_PAYMENT_DAYS,
                    purchaseOrderApi.schema.DOCUMENT_CURRENCY
                )
                .expand(
                    purchaseOrderApi.schema.PURCHASE_ORDER_ITEM
                        .select(purchaseOrderItemApi.schema.PURCHASE_ORDER,
                            purchaseOrderItemApi.schema.PURCHASE_ORDER_ITEM,
                            purchaseOrderItemApi.schema.DOCUMENT_CURRENCY,
                            purchaseOrderItemApi.schema.MATERIAL_GROUP,
                            purchaseOrderItemApi.schema.MATERIAL,
                            purchaseOrderItemApi.schema.MATERIAL_TYPE,
                            purchaseOrderItemApi.schema.SUPPLIER_MATERIAL_NUMBER,
                            purchaseOrderItemApi.schema.MANUFACTURER_PART_NMBR,
                            purchaseOrderItemApi.schema.MANUFACTURER,
                            purchaseOrderItemApi.schema.PURCHASE_ORDER_ITEM_TEXT,
                            purchaseOrderItemApi.schema.PLANT,
                            purchaseOrderItemApi.schema.MANUAL_DELIVERY_ADDRESS_ID,
                            purchaseOrderItemApi.schema.REFERENCE_DELIVERY_ADDRESS_ID,
                            purchaseOrderItemApi.schema.SUBCONTRACTOR,
                            purchaseOrderItemApi.schema.SUPPLIER_IS_SUBCONTRACTOR,
                            purchaseOrderItemApi.schema.STORAGE_LOCATION,
                            purchaseOrderItemApi.schema.PURCHASE_ORDER_QUANTITY_UNIT,
                            purchaseOrderItemApi.schema.NET_PRICE_QUANTITY,
                            purchaseOrderItemApi.schema.IS_COMPLETELY_DELIVERED,
                            purchaseOrderItemApi.schema.IS_FINALLY_INVOICED,
                            purchaseOrderItemApi.schema.IS_ORDER_ACKN_RQD,
                            purchaseOrderItemApi.schema.INVOICE_IS_GOODS_RECEIPT_BASED,
                            purchaseOrderItemApi.schema.PURCHASE_REQUISITION,
                            purchaseOrderItemApi.schema.PURCHASE_REQUISITION_ITEM,
                            purchaseOrderItemApi.schema.EVALD_RCPT_SETTLMT_IS_ALLOWED,
                            purchaseOrderItemApi.schema.REQUISITIONER_NAME,
                            purchaseOrderItemApi.schema.PURCHASE_ORDER_ITEM_CATEGORY,
                            purchaseOrderItemApi.schema.GOODS_RECEIPT_LATEST_CREATION_DATE,
                            purchaseOrderItemApi.schema.ACCOUNT_ASSIGNMENT_CATEGORY,
                            purchaseOrderItemApi.schema.NET_AMOUNT,
                            purchaseOrderItemApi.schema.GROSS_AMOUNT,
                            purchaseOrderItemApi.schema.ORDER_QUANTITY,
                            purchaseOrderItemApi.schema.NET_PRICE_AMOUNT,
                            purchaseOrderItemApi.schema.TAX_CODE,
                            purchaseOrderItemApi.schema.TAX_JURISDICTION,
                            purchaseOrderItemApi.schema.SHIPPING_INSTRUCTION)
                        .expand(
                            purchaseOrderItemApi.schema.PURCHASE_ORDER_SCHEDULE_LINE_TP
                            .select(
                                purchaseOrderScheduleLineApi.schema.SCHEDULE_LINE_DELIVERY_DATE
                            ),
                            purchaseOrderItemApi.schema.PUR_ORD_ACCOUNT_ASSIGNMENT
                            .select(
                                purchaseOrderAccountAssignmentApi.schema.COST_CENTER, 
                                purchaseOrderAccountAssignmentApi.schema.SALES_ORDER,
                                purchaseOrderAccountAssignmentApi.schema.SALES_ORDER_ITEM,
                                purchaseOrderAccountAssignmentApi.schema.WBS_ELEMENT_EXTERNAL_ID,
                                purchaseOrderAccountAssignmentApi.schema.ORDER_ID
                            )
                        )
                    )
                .filter(purchaseOrderApi.schema.PURCHASE_ORDER.equals(req),
                    purchaseOrderApi.schema.PURCHASE_ORDER_ITEM.filter(
                        any(purchaseOrderItemApi.schema.PURCHASE_ORDER_ITEM_CATEGORY.equals('3'))))
                .execute(sdkDest)
                //     {url: 'https://my401968-api.s4hana.cloud.sap',
                //     username: 'ECNOINTEGRATIONUSER',
                //     password: 'oLYHWnkjYxJCoFudli]zvNsyqBdKAX2LJyiwllen'}
                // )
                .catch(err => {
                    req.reject({
                        code: 'Purchase Order Detail',
                        message: err.message,
                        status: 501
                    });
                });


            //To check whether header and item values are fetched
            //and if so then only subcon will be fetched and all details will be returned
            if (headeranditem.length != 0) {

                //serializing header and item data
                const serializedheaderanditem = entitySerializer(
                    purchaseOrderApi.deSerializers)
                    .serializeEntity(headeranditem[0], purchaseOrderApi);

                //fetching subcon details from S/4 HANA cloud
                let subcondetails = await poSubcontractingComponentApi.requestBuilder().getAll()
                    .select(poSubcontractingComponentApi.schema.PURCHASE_ORDER,
                        poSubcontractingComponentApi.schema.PURCHASE_ORDER_ITEM,
                        poSubcontractingComponentApi.schema.SCHEDULE_LINE,
                        poSubcontractingComponentApi.schema.RESERVATION_ITEM,
                        poSubcontractingComponentApi.schema.RECORD_TYPE,
                        poSubcontractingComponentApi.schema.MATERIAL,
                        poSubcontractingComponentApi.schema.RESERVATION,
                        poSubcontractingComponentApi.schema.REQUIRED_QUANTITY,
                        poSubcontractingComponentApi.schema.REQUIREMENT_DATE,
                        poSubcontractingComponentApi.schema.REQUIREMENT_TIME,
                        poSubcontractingComponentApi.schema.RESERVATION_IS_FINALLY_ISSUED,
                        poSubcontractingComponentApi.schema.BASE_UNIT,
                        poSubcontractingComponentApi.schema.QUANTITY_IN_ENTRY_UNIT,
                        poSubcontractingComponentApi.schema.ENTRY_UNIT,
                        poSubcontractingComponentApi.schema.PLANT,
                        poSubcontractingComponentApi.schema.BILL_OF_MATERIAL_ITEM_NUMBER,
                        poSubcontractingComponentApi.schema.BOM_ITEM_CATEGORY,
                        poSubcontractingComponentApi.schema.ACCOUNT_ASSIGNMENT_CATEGORY,
                        poSubcontractingComponentApi.schema.INVENTORY_SPECIAL_STOCK_TYPE,
                        poSubcontractingComponentApi.schema.INVENTORY_SPECIAL_STOCK_VALN_TYPE,
                        poSubcontractingComponentApi.schema.QUANTITY_IS_FIXED,
                        poSubcontractingComponentApi.schema.COMPONENT_SCRAP_IN_PERCENT,
                        poSubcontractingComponentApi.schema.STORAGE_LOCATION,
                        poSubcontractingComponentApi.schema.PRODUCTION_SUPPLY_AREA,
                        poSubcontractingComponentApi.schema.BATCH)
                    .filter(poSubcontractingComponentApi.schema.PURCHASE_ORDER.equals(req),
                        poSubcontractingComponentApi.schema.PURCHASE_ORDER_ITEM_1
                            .filter(purchaseOrderItemApi.schema.PURCHASE_ORDER_ITEM_CATEGORY.equals("3")))
                    .execute(sdkDest)
                    //     {url: 'https://my401968-api.s4hana.cloud.sap',
                    //     username: 'ECNOINTEGRATIONUSER',
                    //     password: 'oLYHWnkjYxJCoFudli]zvNsyqBdKAX2LJyiwllen'
                    // })
                    .catch(err => {
                        req.reject({
                            code: 'Purchase Order Detail',
                            message: err.message,
                            status: 501
                        });
                    });

                //serializing subcon data using loop and storing it into single variable
                let subconlen = subcondetails.length;
                let serializedsub = [];
                for (let i = 0; i < subconlen; i++) {

                    const serializedsubcon = entitySerializer(
                        poSubcontractingComponentApi.deSerializers)
                        .serializeEntity(subcondetails[i], poSubcontractingComponentApi);
                        serializedsubcon.Status_Subcon = "Initial";
                    serializedsub.push(serializedsubcon);
                    
                }

                //pushing only required fields of data into header
                let serializedheader = [];
                serializedheader.push({
                    PurchaseOrder: serializedheaderanditem.PurchaseOrder,
                    PurchaseOrderType: serializedheaderanditem.PurchaseOrderType,
                    CreatedByUser: serializedheaderanditem.CreatedByUser,
                    CreationDate: serializedheaderanditem.CreationDate,
                    PurchaseOrderDate: serializedheaderanditem.PurchaseOrderDate,
                    LastChangeDateTime: serializedheaderanditem.LastChangeDateTime,
                    ValidityStartDate: serializedheaderanditem.ValidityStartDate,
                    ValidityEndDate: serializedheaderanditem.ValidityEndDate,
                    PurchaseOrderDeletionCode: serializedheaderanditem.PurchaseOrderDeletionCode,
                    ReleaseCode: serializedheaderanditem.ReleaseCode,
                    CompanyCode: serializedheaderanditem.CompanyCode,
                    PurchasingOrganization: serializedheaderanditem.PurchasingOrganization,
                    PurchasingGroup: serializedheaderanditem.PurchasingGroup,
                    Supplier: serializedheaderanditem.Supplier,
                    SupplierAddressID: serializedheaderanditem.SupplierAddressID,
                    SupplyingPlant: serializedheaderanditem.SupplyingPlant,
                    InvoicingParty: serializedheaderanditem.InvoicingParty,
                    PaymentTerms: serializedheaderanditem.PaymentTerms,
                    CashDiscount1Days: serializedheaderanditem.CashDiscount1Days,
                    CashDiscount2Days: serializedheaderanditem.CashDiscount2Days,
                    NetPaymentDays: serializedheaderanditem.NetPaymentDays,
                    DocumentCurrency: serializedheaderanditem.DocumentCurrency
                })

                for(let i=0; i<serializedheaderanditem._PurchaseOrderItem.length; i++){
                    let deliveryDate = serializedheaderanditem._PurchaseOrderItem[i]._PurchaseOrderScheduleLineTP[0].ScheduleLineDeliveryDate;
                    let shippingDate = new Date(deliveryDate); 
                    shippingDate.setDate(shippingDate.getDate() - 15);
                    let normalizedShipDate = shippingDate.toLocaleDateString("en-CA");

                    //For schedule line dilevery date 
                    serializedheaderanditem._PurchaseOrderItem[i].ScheduleLineDeliveryDate = deliveryDate;
                    serializedheaderanditem._PurchaseOrderItem[i].ShippingDate = normalizedShipDate;
                    delete serializedheaderanditem._PurchaseOrderItem[i]._PurchaseOrderScheduleLineTP;

                    //For AAO
                    var AACCheck = serializedheaderanditem._PurchaseOrderItem[i].AccountAssignmentCategory;
                    if(AACCheck == 'M' || AACCheck == 'C' || AACCheck == 'E'){
                        var salesOrder = serializedheaderanditem._PurchaseOrderItem[i]._PurOrdAccountAssignment[0].SalesOrder;
                        var soItem = serializedheaderanditem._PurchaseOrderItem[i]._PurOrdAccountAssignment[0].SalesOrderItem;
                        serializedheaderanditem._PurchaseOrderItem[i].AccountAssignmentObject = salesOrder.concat("/", soItem);
                        serializedheaderanditem._PurchaseOrderItem[i].AccountAssignmentObject_desc = "SO"; 
                    }
                    else if(AACCheck == 'P' || AACCheck == 'Q' ){
                        var wbsExId = serializedheaderanditem._PurchaseOrderItem[i]._PurOrdAccountAssignment[0].WBSElementExternalID;
                        serializedheaderanditem._PurchaseOrderItem[i].AccountAssignmentObject = wbsExId;
                        serializedheaderanditem._PurchaseOrderItem[i].AccountAssignmentObject_desc = "WBS";
                    }
                    else if(AACCheck == 'K'){
                        var costCenter = serializedheaderanditem._PurchaseOrderItem[i]._PurOrdAccountAssignment[0].CostCenter;
                        serializedheaderanditem._PurchaseOrderItem[i].AccountAssignmentObject = costCenter;
                        serializedheaderanditem._PurchaseOrderItem[i].AccountAssignmentObject_desc = "CC";
                    }
                    else if(AACCheck == 'F'){
                        var prodOrder = serializedheaderanditem._PurchaseOrderItem[i]._PurOrdAccountAssignment[0].OrderID;
                        serializedheaderanditem._PurchaseOrderItem[i].AccountAssignmentObject = prodOrder;
                        serializedheaderanditem._PurchaseOrderItem[i].AccountAssignmentObject_desc = "ProductionOrder";
                    }

                    //Status

                    serializedheaderanditem._PurchaseOrderItem[i].Status_Item = "Initial";

                    delete serializedheaderanditem._PurchaseOrderItem[i]._PurOrdAccountAssignment;
                }

                //defining object to return which will have header, item and subcon 
                let alldetails = { "header": serializedheader, "item": serializedheaderanditem._PurchaseOrderItem, "subcon": serializedsub };

                return alldetails;
            }

        } catch (err) {
            console.log(err);
        }
    }
})