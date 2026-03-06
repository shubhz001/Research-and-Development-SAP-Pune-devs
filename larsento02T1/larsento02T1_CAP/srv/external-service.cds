using { company.db as my } from '../db/schema';

service CPMaster{
     entity CandidatesDetails as projection on my.CandidatesDetails;
     entity Candidates_Details as projection on my.Candidates_Details;
     function CompareCDwithSF(pid:Integer) returns String;
     function FetchJRData() returns String;
     function MatchingCandidate(Jid:String) returns String;
     function AddNewCandi() returns String;
     function DataSummary() returns String;
     
}



