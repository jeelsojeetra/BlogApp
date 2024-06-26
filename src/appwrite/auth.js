/* eslint-disable no-useless-catch */
import conf from '../conf/conf'
import { Client, Account, ID } from "appwrite";

export class Authservice {
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client);
    }

    // create method for createuser
    async createAccount({email,password,name}){
        try{
                const userAccount = await this.account.create(ID.unique(),email,password,name);
                if(userAccount){
                    //login
                    return this.login({email,password});
                }
                else{
                    return userAccount;
                }
        }
        catch(e){
                throw e;
        }
    }

    //login 
    async login({email,password}){
        try{
               return  await this.account.createEmailPasswordSession(email,password);
        }
        catch(e){
            throw e;
        }
    }

    // get current use
    async getCurrentUser(){
        try{
            return this.account.get();

        }
        catch(e){
            console.log("appwrite error in getcurrentuser : ",e)
        }
    }

    //logout
    async logout(){
        try{
            return this.account.deleteSessions();
        }
        catch(e){
            console.log("appwrite error in logout : ",e);
        }
    }
}


//create object of Authsevice class
const authservice = new Authservice();

export default authservice