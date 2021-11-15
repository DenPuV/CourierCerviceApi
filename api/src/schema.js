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
    GraphQLSchema,
    GraphQLInputObjectType
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

const inputPackageType = new GraphQLInputObjectType({
    name: "ipnutPackage",
    fields: () => ({
        weight: {type: new GraphQLNonNull(GraphQLFloat)},
        description: {type: GraphQLString},
        orderId: {type: new GraphQLNonNull(GraphQLID)}
    })
});

const RouteType = new GraphQLObjectType({
    name: "Route",
    description: "This represents an Route",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        from: {type: GraphQLString},
        to: {type: GraphQLString},
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

const inputRouteType = new GraphQLInputObjectType({
    name: "inputRoute",
    description: "Input route type",
    fields: () => ({
        from: {type: new GraphQLNonNull(GraphQLString)},
        to: {type: new GraphQLNonNull(GraphQLString)}
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
            type: RouteType,
            resolve: async (order) => {
                return (await qs.query(
                    `SELECT * FROM "route" WHERE "orderId" = '${order.id}'`
                ))[0];
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
        ordersByContactId: {
            type: new GraphQLList(OrderType),
            description: "List of all users orders",
            args: {
                contactId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: async (order, args) => {
                return await qs.getOrdersByContactId(args.contactId);
            }
        },
        ordersByLogin: {
            type: new GraphQLList(OrderType),
            description: "List of all users orders",
            args: {
                login: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (order, args) => {
                return await qs.getOrdersByLogin(args.login);
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
            args: {
                route: {
                    type: new GraphQLNonNull(inputRouteType)
                }
            },
            resolve: async (parent, args) => {
                let orderId = await qs.newOrder(schema.context.cookies.login);
                qs.addRoute(orderId, args.route);
                return orderId;
            }
        },
        addPackages: {
            type: new GraphQLList(PackageType),
            description: "Add packages to order",
            args: {
                packages: {
                    type: new GraphQLList(inputPackageType)
                }
            },
            resolve: async (parent, args) => {
                return await qs.addPackages(args.packages);
            }
        },
        setOrderStatus: {
            type: GraphQLString,
            description: "Set new order status",
            args: {
                orderId: {
                    type: new GraphQLNonNull(GraphQLID)
                },
                status: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (parent, args) => {
                return await qs.setOrderStatus(args.orderId, args.status);
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: queryRootType,
    mutation: mutationRootType
});

module.exports = schema;