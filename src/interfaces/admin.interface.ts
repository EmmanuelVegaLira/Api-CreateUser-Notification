export default interface IAdmin {
  name: String
  lastname: String
  email: String
  password: String
  salt?: String
  role: String
  imgUser?: String
  status?: String
  createdDate?: Date
}