namespace company.db;

entity Candidates_Details {
  key personalId : String;
  primaryEmail : String;
  contactEmail : String;
  firstName : String;
  middleName : String;
  lastName : String;
  cellPhone : String;
  homePhone : String;
  address : String;
  address2 : String;
  address3 : String;
  address4 : String;
  city : String;
  country : String;
  candCountry : String;
  state : String;
  zip : String;
  candCurrentTitle : String;
  candCurrentCompany : String;
  formerEmployee : Boolean;
  candComments : String;
  education : String;
  Skills: String;
  CreatedDate:String;
  resume : LargeString;
   matching : array of {
    Sid : Integer;
    matchingPercentage : Integer;
  };
}
entity CandidatesDetails {
  key personalId : Integer;
  primaryEmail : String;
  contactEmail : String;
  firstName : String;
  middleName : String;
  lastName : String;
  cellPhone : String;
  homePhone : String;
  address : String;
  address2 : String;
  address3 : String;
  address4 : String;
  city : String;
  country : String;
  candCountry : String;
  state : String;
  zip : String;
  candCurrentTitle : String;
  candCurrentCompany : String;
  formerEmployee : Boolean;
  candComments : String;
  resume : LargeString;
   matching : array of {
    Sid : Integer;
    matchingPercentage : Integer;
  };
}
