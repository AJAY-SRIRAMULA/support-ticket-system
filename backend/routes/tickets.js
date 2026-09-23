import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { listTickets,getTicket,createTicket,updateTicket,deleteTicket } from '../controllers/ticketController.js';
import { listComments,addComment } from '../controllers/commentController.js';
const router=Router(); router.use(authenticate);
router.get('/',listTickets); router.post('/',authorize('customer'),createTicket); router.get('/:id',getTicket); router.put('/:id',updateTicket); router.delete('/:id',deleteTicket); router.get('/:id/comments',listComments); router.post('/:id/comments',addComment);
export default router;
