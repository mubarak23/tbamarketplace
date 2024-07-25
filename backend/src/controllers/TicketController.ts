// import { Get, Route, Tags, Request, Query, Security, Post, Body, Path, Put } from "tsoa";
// import { getFreshConnection } from "../db";
// import { TicketResponseDto } from "../dto/TicketResponseDto";
// import * as paginationService from "../services/paginationService";
// import * as profileService from "../services/profileService";
// import * as _ from 'underscore';
// import { Ticket } from "../entity/Ticket";
// import { SortOrder } from "../enums/SortOrder";
// import TicketStatuses from "../enums/Statuses";
// import { IPaginatedList } from "../dto/IPaginatedList";
// import { IServerResponse } from "../interfaces/IServerResponse";
// import { INewTicketDto } from "../dto/INewTicketDto";
// import { User } from "../entity/User";
// import { BadRequestError } from "../utils/error-response-types";

// @Route("/api/ticket")
// @Tags("Ticket Service")

// export class TicketController {
//     @Security("jwt")
//     @Get('/all')
//     public async tickets(@Request() req: any,
//     @Query("pageNumber") pageNumber: any,
//     @Query("sortOrder") sortOrder: SortOrder,
//     @Query("status") ticketStatus: TicketStatuses): Promise<IServerResponse<IPaginatedList<TicketResponseDto>>>{
//         const currentUser : User = req.user
//         const connection = await getFreshConnection();
//         const ticketRepo = connection.getRepository(Ticket);
//         let query: any = {}
//         query = {
//         status:ticketStatus,
//         userId: currentUser.id,

//         }
//         const join = {
//             alias: "ticket",
//             leftJoinAndSelect: {
//               user: "ticket.user",
//             },
//           }
//         const pageSize = 10
//         const totalCount = await ticketRepo.count(query)
//         const ticketListsPages = await paginationService.paginate(Ticket, query,
//             pageSize, pageNumber, sortOrder, undefined, join ) as IPaginatedList<Ticket>
//         const ticketLists: Ticket[] = ticketListsPages.dataset;
//         const agentUserIds: number[] = ticketLists.map(ticket => ticket.user.id )

//         const agentsPublicProfiles = await profileService.getPublicProfileFromUserIds(agentUserIds)

//         const transformedTicketsDataset: TicketResponseDto[] = ticketLists.map(ticket => {
//             const agentPublicProfile = agentsPublicProfiles.find(publicProfile =>
//                 publicProfile.userUuid === ticket.user.uuid)
//             if(ticket.images){
//               const ticketResponseImages: {url: string, mimetype: string}[] =
//              ticket.images.map(pImage => _.omit(pImage, 'keyFromCloudProvider', 'fileCloudProvider'))

//             return {
//                 uuid: ticket.uuid,
//                 name: ticket.name,
//                 description: ticket.description,
//                 agentProfile: agentPublicProfile,
//                 customerEmail: ticket.customerEmail,
//                 images: ticketResponseImages,
//                 status: ticket.status
//             }
//          }
//          return {
//             uuid: ticket.uuid,
//             name: ticket.name,
//             description: ticket.description,
//             agentProfile: agentPublicProfile,
//             customerEmail: ticket.customerEmail,
//             status: ticket.status
//         }

//         })
//         const resData = {
//             status: true,
//             data: { pageNumber, pageSize, dataset: transformedTicketsDataset, total: totalCount }
//           };
//         return resData
//     }

// @Post('/new')
// public async handleNewTicket(@Body() reqBody: INewTicketDto): Promise<IServerResponse<void>>{
//     const { name, description, customerEmail, userUuid } = reqBody
//     const connection = await getFreshConnection()
//     const userRepo = connection.getRepository(User)
//     const ticketRepo = connection.getRepository(Ticket)

//     const agentExist = await userRepo.findOne({uuid: userUuid})
//     if(!agentExist){
//         throw new BadRequestError('Agent does not Exist')
//     }

//     const newTicket = new Ticket().initialize(name, description, agentExist.id, customerEmail)
//     await ticketRepo.save(newTicket)

//     const resData :  IServerResponse<void>  ={
//         status: true
//     }
//     return resData
// }

// @Security("jwt")
// @Put('/updateTicket/:ticketUuid/:newTicketStatus')
// public async handleUpdateTicketStatus(
//     @Request() req: any,
//     @Path("ticketUuid") ticketUuid: string,
//     @Path("newTicketStatus") newTicketStatus: TicketStatuses): Promise<IServerResponse<void>>{
//     const cureentUser: User = req.user

//     const connection = await getFreshConnection()
//     const ticketRepo = connection.getRepository(Ticket)
//     const ticketDetails = await ticketRepo.findOne({ uuid: ticketUuid})
//     if(ticketDetails || ticketDetails.userId === cureentUser.id){
//         throw new BadRequestError('The Ticket is not Assign to You')
//     }
//     await ticketRepo.createQueryBuilder()
//     .update(Ticket)
//     .set({ status: newTicketStatus })
//     .where({ id: ticketDetails.id })
//     .execute()

//     const resData :  IServerResponse<void>  ={
//         status: true
//     }
//     return resData
// }

// }
