

const ConnPrefix = "http://localhost:3000"
const LoginConn = ConnPrefix + "/api/login"
const RegisterConn = ConnPrefix + "/api/register"


const ProjectListConn = ConnPrefix + "/api/getprojectlist"

const conns = {ConnPrefix: ConnPrefix , LoginConn: LoginConn, RegisterConn: RegisterConn, ProjectListConn:ProjectListConn}

export default conns