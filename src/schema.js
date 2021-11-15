const qs = require("../queries");
const _ = require("lodash");
let {
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema
} = require('graphql');

const RoleType = new GraphQLObjectType({
    name: "Role",
    description: "This represent an role",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        code: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString}
    })
});

const StatusType = new GraphQLObjectType({
    name: "Status",
    description: "This represent an status",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        code: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString}
    })
});

const PackageType = new GraphQLObjectType({
    name: "Package",
    description: "This represents an Package",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        weight: {type: new GraphQLNonNull(GraphQLFloat)},
        description: {type: GraphQLString},
        orderId: {type: new GraphQLNonNull(GraphQLID)},
        order: {
            type: new GraphQLNonNull(OrderType),
            resolve: async (package) => {
                let order = await qs.query(
                    `SELECT * FROM "order" WHERE "id" = '${package.orderId}'`
                );
                return order[0];
            }
        }
    })
});

const RouteType = new GraphQLObjectType({
    name: "Route",
    description: "This represents an Route",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        from: {type: new GraphQLNonNull(GraphQLString)},
        to: {type: new GraphQLNonNull(GraphQLString)},
        orderId: {type: new GraphQLNonNull(GraphQLID)},
        order: {
            type: new GraphQLNonNull(OrderType),
            resolve: async (route) => {
                let order = await qs.query(
                    `SELECT * FROM "order" WHERE "id" = '${route.orderId}'`
                );
                return order[0];
            }
        }
    })
});

const OrderType = new GraphQLObjectType({
    name: "Order",
    description: "This represents an Order",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        number: {type: new GraphQLNonNull(GraphQLInt)},
        date: {type: new GraphQLNonNull(GraphQLString)},
        contactId: {type: new GraphQLNonNull(GraphQLID)},
        statusId: {type: GraphQLID},
        contact: {
            type: new GraphQLNonNull(ContactType),
            resolve: async function(order) {
                let contact = await qs.query(
                    `SELECT * FROM "contact" c WHERE c."id" = '${order.contactId}'`
                );
                return contact[0];
                
            }
        },
        status: {
            type: StatusType,
            resolve: async function(order) {
                let status = await qs.query(
                    `SELECT * FROM "status" s WHERE s."id" = '${order.statusId}'`
                );
                return status[0];
            }
        },
        packages: {
            type: new GraphQLList(PackageType),
            resolve: async (order) => {
                return await qs.query(
                    `SELECT * FROM "package" WHERE "orderId" = '${order.id}'`
                );
            }
        },
        route: {
            type: new GraphQLList(RouteType),
            resolve: async (order) => {
                return await qs.query(
                    `SELECT * FROM "route" WHERE "orderId" = '${order.id}'`
                );
            }
        }
    })
});

const ContactType = new GraphQLObjectType({
    name: "Contact",
    description: "This represent an contact",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        firstName: {type: new GraphQLNonNull(GraphQLString)},
        secondName: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: GraphQLString},
        phone: {type: GraphQLString}
    })
});

const queryRootType = new GraphQLObjectType({
    name: "CourierServiceSchema",
    description: "Blog Application Schema Query Root",
    fields: () => ({
        contacts: {
            type: new GraphQLList(ContactType),
            description: "List of all Contacts",
            resolve: async function() {
                return await qs.getContacts();
            }
        },
        orders: {
            type: new GraphQLList(OrderType),
            description: "List of all users orders",
            args: {
                contactId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: async (order, args) => {
                let orders = await qs.query(
                    `SELECT * FROM "order" WHERE "contactId" = '${args.contactId}'`
                );
                return orders;
            }
        }
    })
});

const mutationRootType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root mutation",
    fields: () => ({
        addOrder: {
            type: GraphQLID,
            description: "Add an order",
            resolve: async () => {
                return await qs.newOrder(schema.context.cookies.login);
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: queryRootType,
    mutation: mutationRootType
});

module.exports = schema;