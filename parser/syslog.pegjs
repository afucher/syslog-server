log
  = header:header prival:prival version:version datetime:datetime space hostname:hostname space appname:appname space procid:procid space msgid:msgid space message:message? space? freeMessage:freeMessage? {return {"header":header,"prival":prival,"version":version,"datetime":datetime,"hostname":hostname,"appname":appname,"procid":procid,"msgid":msgid,"message":message,"freeMessage":freeMessage };}

header
  = header:Numbers space {return header;}

prival
  = "<" left:Numbers ">" {return { fac : left >> 3, sev : left & 7};}

version
  = version:Numbers space {return version;}

hostname = host:complexWord

appname = name:(word / Symbols)* {return name.join("");}

procid = Numbers

msgid = text:word / text:"-" {return text == "-" ? "-" : text.join("");}

message = ("[" text:myText "]") /  text:"-" {return text;}

myText = text:(word / space / Symbols)* {return text.join("");}

complexWord = word:(letter+ / Symbols+)* {return word.join("");}

word = letter+

freeMessage = char:.* {return char.join("");}

Text
  = Numbers Text
  / Characters Text
  /  Symbols  Text
  / space

datetime
  = year:Numbers "-" month:Numbers "-" day:Numbers Characters hour:Numbers ":" minute:Numbers ":" seconds:Numbers "." Numbers "-" Numbers ":" Numbers {return new Date(year, month-1, day, hour, minute, seconds);}
additive
  = left:multiplicative "+" right:additive { return left + right; }
  / multiplicative

multiplicative
  = left:primary "*" right:multiplicative { return left * right; }
  / primary

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

Numbers
  = numbers: [0-9]+ {return numbers.join("")}

space = " " {return "";}

Characters
  = text: [a-zA-Z]+ {return text.join("")}

Symbols
  = symbols: "." / "(" / ")" / "@" / "=" / '"' / "-" / "*" / "\n" / ":" / "<" / ">" / "?" / "," / "/"  / "_"

EOF
  = !.

letter = text: [a-zA-Z0-9]+ {return text.join("")}