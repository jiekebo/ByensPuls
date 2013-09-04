%lex
%%

\n+                                    return 'EOL'
[ ]+                                   /* Skip spaces */
[-]?[0-9]+("."[0-9]+)?\b               return 'NUMBER'
"STATUS"                               return 'STATUS'
"TID"                                  return 'TID'
"MED"                                  return 'MED'
"'"[^\u0027]*"'"                       return 'MESSAGE'
"TTP"                                  return 'TTP'
"FOR"                                  return 'FOR'
"POS"                                  return 'POS'
"STP"                                  return 'STP'
"AFM"                                  return 'AFM'
[A-Z\u00C6\u00D8\u00C5]{2,3}           return 'STATION'
[A-Z][0-9]?                            return 'LINIE'
<<EOF>>                                return 'EOF'

/lex

%start status

%% /* language grammar */

status
    : instrlist
    ;

instrlist
    : inst EOL instrlist { }
    | inst EOF { return yy; }
    | EOF { return yy; }
    ;

inst
    : STATUS
        //{$$ = console.log("Status");}
    | TID NUMBER
        //{$$ = console.log("Tid: " + $2);}
    | MED MESSAGE
        //{$$ = console.log("Meddelelse: " + $2);}
    | TTP NUMBER STP LINIE STATION
        {
            var tog = new ByensPuls.TogData($3, $4, $5);
            $$ = yy.addTogData($2, tog)
        }
    | TTP NUMBER AFM LINIE STATION
        {
            $$ = yy.removeTog($2);
        }
    | FOR NUMBER NUMBER
        //{$$ = console.log("Forsinkelse : " + $2 + ", " + $3);}
    | POS NUMBER NUMBER NUMBER NUMBER
        {
            var update = new ByensPuls.TogPosition($3, $4, $5);
            $$ = yy.addTogPosition($2, update);
        }
    ;