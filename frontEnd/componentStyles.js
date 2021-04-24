import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
  },

  header: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "bold",
  },

  subHeader: {
    fontSize: 15,
    fontWeight: "bold",
  },

  inputView: {
    backgroundColor: "#C0C0C0",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    textAlign: "center",
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  signUp_button: {
      height: 30,
      marginTop: 10,
    },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#2196F3",
  },

  fab: {
    position: 'absolute',
    margin: 16,
    backgroundColor: "#8DFFF9",
    right: 0,
    top: 0,
  },

  profileContainer: {
    flex: 1,
    padding: 20,

  },

  cardStyle:{
    padding: 10,
    marginTop: 10,
  },

  balanceAmount:{
    marginBottom: 10,
    fontSize: 35,
    fontWeight: "bold",
  },

  classroomContainer:{
    flex: 1,
    padding: 20,
  },

  studentCards:{
    padding: 10,
    marginTop: 10,
  },

  teacherPayCards:{
    padding: 10,
    marginTop: 10,
    backgroundColor: "#add8e6",
  },

  storeContainer:{
    flex: 1,
    padding: 20,
  },

  createClassBtn:{
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8DFFF9",
  },
});