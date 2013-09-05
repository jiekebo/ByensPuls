/** Byens Puls HTML5 0.9.9
 *  (c) 2013 Jacob Salomonsen
 *  @license Simplified BSD license.
 */
(function(){"use strict";function ByensPuls(){this.togListe=[]}ByensPuls.TogData=function(action,linie,station){this.action=action,this.linie=linie,this.station=station},ByensPuls.TogPosition=function(positionx,positiony,angle){this.x=positionx,this.y=positiony,this.angle=angle},ByensPuls.prototype.addTogData=function(number,data){var tog=this.getTog(number);tog.data=data},ByensPuls.prototype.addTogPosition=function(number,position){var tog=this.getTog(number);tog.position=position},ByensPuls.prototype.getTog=function(number){var togEntry=this.togListe[number];return(null==togEntry||"undefined"==togEntry)&&(togEntry={},this.togListe[number]=togEntry),togEntry},ByensPuls.prototype.removeTog=function(number){this.togListe[number],console.log("will remove tog "+number)},ByensPuls.prototype.addDelay=function(number,delay){var tog=this.getTog(number);tog.delay=delay};var grammar=function(){function Parser(){this.yy={}}var parser={trace:function(){},yy:{},symbols_:{error:2,status:3,instrlist:4,inst:5,EOL:6,EOF:7,STATUS:8,TID:9,NUMBER:10,MED:11,MESSAGE:12,TTP:13,STP:14,LINIESTATION:15,STM:16,AFM:17,UKE:18,FOR:19,POS:20,$accept:0,$end:1},terminals_:{2:"error",6:"EOL",7:"EOF",8:"STATUS",9:"TID",10:"NUMBER",11:"MED",12:"MESSAGE",13:"TTP",14:"STP",15:"LINIESTATION",16:"STM",17:"AFM",18:"UKE",19:"FOR",20:"POS"},productions_:[0,[3,1],[4,3],[4,2],[4,1],[5,1],[5,2],[5,2],[5,5],[5,5],[5,5],[5,5],[5,3],[5,5]],performAction:function(yytext,yyleng,yylineno,yy,yystate,$$){var $0=$$.length-1;switch(yystate){case 2:break;case 3:return yy;case 4:return yy;case 8:var tog=new ByensPuls.TogData($$[$0-2],$$[$0-1],$$[$0]);this.$=yy.addTogData($$[$0-3],tog);break;case 9:var tog=new ByensPuls.TogData($$[$0-2],$$[$0-1],$$[$0]);this.$=yy.addTogData($$[$0-3],tog);break;case 10:this.$=yy.removeTog($$[$0-3]);break;case 12:this.$=yy.addDelay($$[$0-1],$$[$0]);break;case 13:var update=new ByensPuls.TogPosition($$[$0-2],$$[$0-1],$$[$0]);this.$=yy.addTogPosition($$[$0-3],update)}},table:[{3:1,4:2,5:3,7:[1,4],8:[1,5],9:[1,6],11:[1,7],13:[1,8],19:[1,9],20:[1,10]},{1:[3]},{1:[2,1]},{6:[1,11],7:[1,12]},{1:[2,4]},{6:[2,5],7:[2,5]},{10:[1,13]},{12:[1,14]},{10:[1,15]},{10:[1,16]},{10:[1,17]},{4:18,5:3,7:[1,4],8:[1,5],9:[1,6],11:[1,7],13:[1,8],19:[1,9],20:[1,10]},{1:[2,3]},{6:[2,6],7:[2,6]},{6:[2,7],7:[2,7]},{14:[1,19],16:[1,20],17:[1,21],18:[1,22]},{10:[1,23]},{10:[1,24]},{1:[2,2]},{15:[1,25]},{15:[1,26]},{15:[1,27]},{10:[1,28]},{6:[2,12],7:[2,12]},{10:[1,29]},{15:[1,30]},{15:[1,31]},{15:[1,32]},{10:[1,33]},{10:[1,34]},{6:[2,8],7:[2,8]},{6:[2,9],7:[2,9]},{6:[2,10],7:[2,10]},{6:[2,11],7:[2,11]},{6:[2,13],7:[2,13]}],defaultActions:{2:[2,1],4:[2,4],12:[2,3],18:[2,2]},parseError:function(str,hash){if(!hash.recoverable)throw new Error(str);this.trace(str)},parse:function(input){function lex(){var token;return token=self.lexer.lex()||EOF,"number"!=typeof token&&(token=self.symbols_[token]||token),token}var self=this,stack=[0],vstack=[null],lstack=[],table=this.table,yytext="",yylineno=0,yyleng=0,recovering=0,TERROR=2,EOF=1;this.lexer.setInput(input),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,"undefined"==typeof this.lexer.yylloc&&(this.lexer.yylloc={});var yyloc=this.lexer.yylloc;lstack.push(yyloc);var ranges=this.lexer.options&&this.lexer.options.ranges;this.parseError="function"==typeof this.yy.parseError?this.yy.parseError:Object.getPrototypeOf(this).parseError;for(var symbol,preErrorSymbol,state,action,r,p,len,newState,expected,yyval={};;){if(state=stack[stack.length-1],this.defaultActions[state]?action=this.defaultActions[state]:((null===symbol||"undefined"==typeof symbol)&&(symbol=lex()),action=table[state]&&table[state][symbol]),"undefined"==typeof action||!action.length||!action[0]){var errStr="";expected=[];for(p in table[state])this.terminals_[p]&&p>TERROR&&expected.push("'"+this.terminals_[p]+"'");errStr=this.lexer.showPosition?"Parse error on line "+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(", ")+", got '"+(this.terminals_[symbol]||symbol)+"'":"Parse error on line "+(yylineno+1)+": Unexpected "+(symbol==EOF?"end of input":"'"+(this.terminals_[symbol]||symbol)+"'"),this.parseError(errStr,{text:this.lexer.match,token:this.terminals_[symbol]||symbol,line:this.lexer.yylineno,loc:yyloc,expected:expected})}if(action[0]instanceof Array&&action.length>1)throw new Error("Parse Error: multiple actions possible at state: "+state+", token: "+symbol);switch(action[0]){case 1:stack.push(symbol),vstack.push(this.lexer.yytext),lstack.push(this.lexer.yylloc),stack.push(action[1]),symbol=null,preErrorSymbol?(symbol=preErrorSymbol,preErrorSymbol=null):(yyleng=this.lexer.yyleng,yytext=this.lexer.yytext,yylineno=this.lexer.yylineno,yyloc=this.lexer.yylloc,recovering>0&&recovering--);break;case 2:if(len=this.productions_[action[1]][1],yyval.$=vstack[vstack.length-len],yyval._$={first_line:lstack[lstack.length-(len||1)].first_line,last_line:lstack[lstack.length-1].last_line,first_column:lstack[lstack.length-(len||1)].first_column,last_column:lstack[lstack.length-1].last_column},ranges&&(yyval._$.range=[lstack[lstack.length-(len||1)].range[0],lstack[lstack.length-1].range[1]]),r=this.performAction.call(yyval,yytext,yyleng,yylineno,this.yy,action[1],vstack,lstack),"undefined"!=typeof r)return r;len&&(stack=stack.slice(0,2*-1*len),vstack=vstack.slice(0,-1*len),lstack=lstack.slice(0,-1*len)),stack.push(this.productions_[action[1]][0]),vstack.push(yyval.$),lstack.push(yyval._$),newState=table[stack[stack.length-2]][stack[stack.length-1]],stack.push(newState);break;case 3:return!0}}return!0}},lexer=function(){var lexer={EOF:1,parseError:function(str,hash){if(!this.yy.parser)throw new Error(str);this.yy.parser.parseError(str,hash)},setInput:function(input){return this._input=input,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var ch=this._input[0];this.yytext+=ch,this.yyleng++,this.offset++,this.match+=ch,this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);return lines?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),ch},unput:function(ch){var len=ch.length,lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-len-1),this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),lines.length-1&&(this.yylineno-=lines.length-1);var r=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len},this.options.ranges&&(this.yylloc.range=[r[0],r[0]+this.yyleng-len]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},less:function(n){this.unput(this.match.slice(n))},pastInput:function(){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var next=this.match;return next.length<20&&(next+=this._input.substr(0,20-next.length)),(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var pre=this.pastInput(),c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},test_match:function(match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer&&(backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(backup.yylloc.range=this.yylloc.range.slice(0))),lines=match[0].match(/(?:\r\n?|\n).*/g),lines&&(this.yylineno+=lines.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length},this.yytext+=match[0],this.match+=match[0],this.matches=match,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(match[0].length),this.matched+=match[0],token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),token)return token;if(this._backtrack){for(var k in backup)this[k]=backup[k];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var token,match,tempMatch,index;this._more||(this.yytext="",this.match="");for(var rules=this._currentRules(),i=0;i<rules.length;i++)if(tempMatch=this._input.match(this.rules[rules[i]]),tempMatch&&(!match||tempMatch[0].length>match[0].length)){if(match=tempMatch,index=i,this.options.backtrack_lexer){if(token=this.test_match(tempMatch,rules[i]),token!==!1)return token;if(this._backtrack){match=!1;continue}return!1}if(!this.options.flex)break}return match?(token=this.test_match(match,rules[index]),token!==!1?token:!1):""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var r=this.next();return r?r:this.lex()},begin:function(condition){this.conditionStack.push(condition)},popState:function(){var n=this.conditionStack.length-1;return n>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(n){return n=this.conditionStack.length-1-Math.abs(n||0),n>=0?this.conditionStack[n]:"INITIAL"},pushState:function(condition){this.begin(condition)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(yy,yy_,$avoiding_name_collisions,YY_START){switch($avoiding_name_collisions){case 0:return 6;case 1:break;case 2:return 10;case 3:return 8;case 4:return 9;case 5:return 11;case 6:return 12;case 7:return 13;case 8:return 19;case 9:return 20;case 10:return 14;case 11:return 16;case 12:return 17;case 13:return 18;case 14:return 15;case 15:return 7}},rules:[/^(?:\n+)/,/^(?:[ ]+)/,/^(?:[-]?[0-9]*(\.[0-9]+)?\b)/,/^(?:STATUS\b)/,/^(?:TID\b)/,/^(?:MED\b)/,/^(?:'[^\u0027]*')/,/^(?:TTP\b)/,/^(?:FOR\b)/,/^(?:POS\b)/,/^(?:STP\b)/,/^(?:STM\b)/,/^(?:AFM\b)/,/^(?:UKE\b)/,/^(?:[A-Z0-9\u00C6\u00D8\u00C5]{1,3})/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],inclusive:!0}}};return lexer}();return parser.lexer=lexer,Parser.prototype=parser,parser.Parser=Parser,new Parser}();"undefined"!=typeof require&&"undefined"!=typeof exports&&(exports.parser=grammar,exports.Parser=grammar.Parser,exports.parse=function(){return grammar.parse.apply(grammar,arguments)},exports.main=function(args){args[1]||(console.log("Usage: "+args[0]+" FILE"),process.exit(1));var source=require("fs").readFileSync(require("path").normalize(args[1]),"utf8");return exports.parser.parse(source)},"undefined"!=typeof module&&require.main===module&&exports.main(process.argv.slice(1))),ByensPuls.parse=function(input){return grammar.yy=new ByensPuls,grammar.parse(input)},this.ByensPuls=ByensPuls}).call(this);
//# sourceMappingURL=build/byenspuls-min.js.map