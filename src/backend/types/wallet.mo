import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type UserProfile = {
    id : UserId;
    var walletBalance : Int;
    var isAdmin : Bool;
    createdAt : Timestamp;
  };

  public type UserProfileView = {
    id : UserId;
    walletBalance : Int;
    isAdmin : Bool;
    createdAt : Timestamp;
  };

  public type TopUpResult = {
    #ok : Int;
    #err : Text;
  };
};
