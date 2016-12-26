// 包号定义
exports.PACKETID_CT_SENDTASK_CMD = 1; // 告知control开始处理任务

// 与control通信的数据包    
var SimulationRequestMsg = require('../proto/gerris_simulation_msg.js')['SimulationRequestMsg'];


// packet 1
exports.SimulationRequestMsg = SimulationRequestMsg;


