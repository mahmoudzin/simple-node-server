import express from 'express';
import cors from 'cors';
import UsersController from './UsersController.js';
import TransferController from './TransferController.js';


const userController = new UsersController();
const transferController = new TransferController();

const app = express();

const port = 8080;

app.use(express.urlencoded());
app.use(express.json());
app.use(cors({origin: '*', method: '*'}));




app.get('/getAllUsers', (req, res) => {
    userController.getAllUsers().then(data => {
        res.status(200).send(data);
    })
});

app.get('/getAllTransfers', (req, res) => {
    transferController.getAllTransfers().then(data => {
        res.status(200).send(data);
    })
});

app.post('/newTransfer', (req, res)=>{
    const transfer = req.body;
    userController.checkSender(transfer.sender_id, transfer.quantity)
    .then((user)=> {
        if(user) {
            userController.updateSenderBalance(transfer.sender_id, transfer.quantity)
            .then(()=> userController.updateReceiverBalance(transfer.receiver_id, transfer.quantity))
            .then(()=> transferController.newTransfer(transfer).then(data => res.status(200).send({message: data})))
        }else{
            res.status(200).send({message: `the user that try does this transaction has no money enough`})
        }
    })
})
const server = app.listen(port, ()=> {
    const host = server.address().address
    const port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});