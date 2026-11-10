// Each question offers one fresh retry. Empty submissions do not count.
export function answerAttempt(mistakes,correct){return correct?{mistakes:mistakes||0,status:'correct'}:{mistakes:(mistakes||0)+1,status:(mistakes||0)===0?'retry':'moveOn'};}
