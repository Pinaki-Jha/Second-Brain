const ConnPrefix = "http://localhost:3000"

const LoginConn = ConnPrefix + "/api/auth/login"
const RegisterConn = ConnPrefix + "/api/auth/register"
const CheckUsernameConn = ConnPrefix + '/api/auth/check-username'

const ProjectListConn = ConnPrefix + "/api/getprojectlist"

const conns = {
    ConnPrefix: ConnPrefix ,
    LoginConn: LoginConn, 
    RegisterConn: RegisterConn, 
    CheckUsernameConn: CheckUsernameConn,
    ProjectListConn:ProjectListConn,}

export default conns