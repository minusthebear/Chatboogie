function Room(id, time) {
  this.id = id;
  this.people = [];
  this.doctors = [];
  this.private = true;
  this.timeCreated = time;
  this.status = "available";
};

Room.prototype.addPerson = function(personID) {
  if (this.status === "available") {
    this.people.push(personID);
    this.status = "unavailable";
  } else {
    return false;
  }
};

Room.prototype.getTimeCreated = function(){
  console.log(this.timeCreated);
  var x = this.timeCreated;
  return x;
}

Room.prototype.addDoctor = function(doctorID) {
  this.doctors.push(doctorID);
};

Room.prototype.removePerson = function(person) {
  var personIndex = -1;
  for(var i = 0; i < this.people.length; i++){
    if(this.people[i] === person){
      var str = this.people[i]
      this.people.splice(this.people.indexOf(str), 1);
      break;
    }
  }
  this.status = "available";
};

Room.prototype.getPerson = function(personID) {
  var person = null;
  for(var i = 0; i < this.people.length; i++) {
    if(this.people[i] === personID) {
      person = this.people[i];
      break;
    }
  }
  return person;
};

Room.prototype.removeDoctor = function(doctorID) {
  var doctorIndex = -1;
  console.log(doctorID);
  for(var i = 0; i < this.doctors.length; i++){
    if(this.doctors[i] === doctorID){
      var str = this.doctors[i];
      this.doctors.splice(this.doctors.indexOf(str), 1);
      break;
    }
  }
};

Room.prototype.getDoctor = function(doctorID) {
  var doctor = null;
  for(var i = 0; i < this.doctors.length; i++) {
    if(this.doctors[i].id == doctorID) {
      doctor = this.doctors[i];
      break;
    }
  }
  return doctor;
};

Room.prototype.isPrivate = function() {
  if (this.private) {
    return true;
  } else {
    return false;
  }
};

module.exports = Room;
