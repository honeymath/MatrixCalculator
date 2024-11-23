Vue.component('calculator',{
  data : function(){
    return{
      matrices:[],
      signs:[],// true= inverse, false = non-inverse
      degrees:[],
      history:[],
      script:[],
      steps:[],
      currentscript:"",
      lastscr:"",
      currentscr:"",
      superstatus:"",
      lock:false,
      polynomial:false,
      appendbutton:false,
      prependbutton:false,
      newmatrix:false,
      frommatrixindex:-1,
      fromfactorindex:-1,
      fromrow:-1,
      fromcolumn:-1,
      tomatrixindex:-1,
      tofactorindex:-1,
      torow:-1,
      tocolumn:-1,
      status:"Go ahead.",
	symbol:"",
	cha:"",
	storagematrix:""
    }
  },
  template:`<div>
  <div style="background-color:pink">
    <input type="checkbox" v-on:click="completematrix()" v-model="polynomial">Polynomial mode</input>
  </div>

  <div v-if="lock">
        <button v-on:click="lock=!lock">Edit</button>
        <button v-on:click="goback()" v-if="history.length>1">Back</button>
  </div>
  <div v-else>
      <div>
        <div style="height:120px">
          <button v-if="matrices.length>1" v-on:click="refresh()">Start calculation</button>
    <button v-if="matrices.length==0" v-on:click="newmatrix=!newmatrix">New matrix</button>
    
  <button v-if="!prependbutton && matrices.length!=0 &&signs[0]" v-on:click="appendbutton=!appendbutton">Prepend</button>
  
  

  <button v-if="!signs[0] && matrices.length!=0" v-on:click="appendfactor(countrows(0),countrows(0),true)">Prepend (inverse)</button>
  <button v-if="!signs[0] && matrices.length!=0&&appendable()&&issquarematrix()" v-on:click="appendfactor(countrows(0),countrows(0),true,true)" style="color:blue">Paste Prepend (inverse)</button>

  <button v-if="!appendbutton && matrices.length!=0 &&signs[signs.length-1]" v-on:click="prependbutton=!prependbutton">Append</button>
  <button v-if="!signs[signs.length-1] && matrices.length!=0" v-on:click="prependfactor(countcols(signs.length-1),countcols(signs.length-1),true)">Append (inverse)</button>
  <button v-if="!signs[signs.length-1] && matrices.length!=0&&prependable()&&issquarematrix()" v-on:click="prependfactor(countcols(signs.length-1),countcols(signs.length-1),true)" style="color:blue">Paste Append (inverse)</button>
      <div v-if="appendbutton">
            <div>select append size:</div>
            <div>
            <button v-on:click="appendfactor(1,countrows(0),false)">1</button>
            <button v-on:click="appendfactor(2,countrows(0),false)">2</button>
            <button v-on:click="appendfactor(3,countrows(0),false)">3</button>
            </div>
            <div>
            <button v-on:click="appendfactor(4,countrows(0),false)">4</button>
            <button v-on:click="appendfactor(5,countrows(0),false)">5</button>
            <button v-on:click="appendfactor(6,countrows(0),false)">6</button>
            </div>
            <div>
            <button v-on:click="appendfactor(7,countrows(0),false)">7</button>
            <button v-on:click="appendfactor(8,countrows(0),false)">8</button>
            <button v-on:click="appendfactor(9,countrows(0),false)">9</button>
            </div>
	    <div v-if="ispasteavailable()">
	       <button v-if="appendable()" v-on:click="appendfactor(0,0,false,true)">Paste matrix</button>
	       <span v-if="!appendable()" style="color:pink">Warning: Paste Option is unavailable since the matrix size does not match</span>
	    </div>
        </div>

        <div v-if="newmatrix">
            <div>select matrix size:</div>
            <div>
            <button v-on:click="appendfactor(1,1,true)">1</button>
            <button v-on:click="appendfactor(2,2,true)">2</button>
            <button v-on:click="appendfactor(3,3,true)">3</button>
            </div>
            <div>
            <button v-on:click="appendfactor(4,4,true)">4</button>
            <button v-on:click="appendfactor(5,5,true)">5</button>
            <button v-on:click="appendfactor(6,6,true)">6</button>
            </div>
            <div>
            <button v-on:click="appendfactor(7,7,true)">7</button>
            <button v-on:click="appendfactor(8,8,true)">8</button>
            <button v-on:click="appendfactor(9,9,true)">9</button>
            </div>
	    <div v-if="ispasteavailable()">
	       <button v-if="issquarematrix()" v-on:click="appendfactor(0,0,true,true)">Paste matrix</button>
	       <span v-if="!issquarematrix()" style="color:pink">Warning: Paste Option is unavailable since the matrix is not square</span>
	    </div>
        </div>
    
        
      <div v-if="prependbutton">
            <div>select prepend size:</div>
            <div>
            <button v-on:click="prependfactor(countcols(signs.length-1),1,false)">1</button>
            <button v-on:click="prependfactor(countcols(signs.length-1),2,false)">2</button>
            <button v-on:click="prependfactor(countcols(signs.length-1),3,false)">3</button>
            </div>
            <div>
            <button v-on:click="prependfactor(countcols(signs.length-1),4,false)">4</button>
            <button v-on:click="prependfactor(countcols(signs.length-1),5,false)">5</button>
            <button v-on:click="prependfactor(countcols(signs.length-1),6,false)">6</button>
            </div>
            <div>
            <button v-on:click="prependfactor(countcols(signs.length-1),7,false)">7</button>
            <button v-on:click="prependfactor(countcols(signs.length-1),8,false)">8</button>
            <button v-on:click="prependfactor(countcols(signs.length-1),9,false)">9</button>
            </div>
	    <div v-if="ispasteavailable()">
	       <button v-if="prependable()" v-on:click="prependfactor(0,0,false,true)">Paste matrix</button>
	       <span v-if="!prependable()" style="color:pink">Warning: Paste Option is unavailable since the matrix size does not match</span>
	    </div>
        </div>
        </div>
      </div>
  </div>

  <div v-for="(factor,factorindex) in matrices ">
    
    <div :class = "signs[factorindex]?'inversefactor':'factor'">
            <div v-if="!lock&&polynomial">
          <button v-if="factorindex==0||factorindex==matrices.length-1" v-on:click="deletefactor(factorindex)">delete factor</button>
          </div>
          <div v-if="false&&!lock&&polynomial">
          degree={{degrees[factorindex]}} 
          <button v-on:click="degrees.splice(factorindex,1,degrees[factorindex]+1)">+</button>
            <button v-if="degrees[factorindex]>0" v-on:click="degrees.splice(factorindex,1,degrees[factorindex]-1)">-</button>
            
          </div>
      
      

          <div v-if="lock">
            <div v-for="(matrix,matrixindex) in factor" v-if="polynomial||degrees[factorindex]==matrixindex" class = "matrix" v-on:mouseout="initializefromto()">
                <div v-if = "matrixindex==0"></div>
              <div v-else class="sign">
                <span v-if="degrees[factorindex]!=matrixindex-1&&polynomial">
                     t<sup v-html="degrees[factorindex]-matrixindex+1"></sup>
                     </span>
                     <span v-if="polynomial">+</span>
              </div>

              <div v-for="(column,columnindex) in matrix" class = "column">
                    <div draggable="true" class = "entry controlbox" v-on:drag="tesla($event,factorindex,matrixindex,columnindex,-1)" v-on:dragover="allowdrop($event,factorindex,matrixindex,columnindex,-1)"  v-on:drop="drop($event,factorindex,matrixindex,columnindex,-1)" v-on:mouseover="mouseovercol(factorindex,matrixindex,columnindex,-1)" v-on:mouseout="initializefromto()" v-on:click="click()"></div>
                      <span v-for="(entry,entryindex) in column">
                      <div draggable="true" :class = "fromrow==entryindex&&fromcolumn==columnindex&&fromfactorindex==factorindex&&frommatrixindex==matrixindex?'entry fromselfbox':torow==entryindex&&tocolumn==columnindex&&tofactorindex==factorindex&&tomatrixindex==matrixindex?'entry toselfbox':fromrow==torow&&fromfactorindex==tofactorindex&&frommatrixindex==tomatrixindex?fromcolumn==columnindex&&fromfactorindex-signs[fromfactorindex]==factorindex-signs[factorindex]?'entry frombox':tocolumn==columnindex&&fromfactorindex-signs[fromfactorindex]==factorindex-signs[factorindex]?'entry tobox':'entry regularbox':fromcolumn==tocolumn&&fromfactorindex==tofactorindex&&frommatrixindex==tomatrixindex?fromrow==entryindex&&fromfactorindex+signs[fromfactorindex]==factorindex+signs[factorindex]?'entry frombox':torow==entryindex&&fromfactorindex+signs[fromfactorindex]==factorindex+signs[factorindex]?'entry tobox':'entry regularbox':'entry regularbox'" v-html="entry" v-on:drag="tesla($event,factorindex,matrixindex,columnindex,entryindex)" v-on:dragover="allowdrop($event,factorindex,matrixindex,columnindex,entryindex)"  v-on:drop="drop($event,factorindex,matrixindex,columnindex,entryindex)">
                      </div>
                      </span>
                    </div>
                <div class = "column">
                    <div class = "entry cornerbox" v-on:mouseover="superstatus='Hint: Click to copy the matrix'" v-on:mouseout="superstatus=''" v-on:click="copymatrix(factorindex,matrixindex)"><span v-if="signs[factorindex]"><!-- inverse here--></span></div>
                    <span v-for="(entry,entryindex) in matrix[0]">
                      <div draggable="true" class = "entry controlbox" v-on:drag="tesla($event,factorindex,matrixindex,-1,entryindex)" v-on:dragover="allowdrop($event,factorindex,matrixindex,-1,entryindex)"  v-on:drop="drop($event,factorindex,matrixindex,-1,entryindex)" v-on:mouseover="mouseovercol(factorindex,matrixindex,-1,entryindex)" v-on:mouseout="initializefromto()" v-on:click="click()"></div>
                    </span>
                </div>
                <div v-if="matrixindex==factor.length-1" class="sign">
                    <span v-if="degrees[factorindex]!=matrixindex">
                     t<sup v-html="degrees[factorindex]-matrixindex"></sup>
                     </span>
                </div>
                
              </div>
          </div>
          <div v-else style="float:top">
            <div v-for="(matrix,matrixindex) in factor" v-if="polynomial||degrees[factorindex]==matrixindex" class = "matrix">
              <div v-if = "matrixindex==0" class="sign">
                <button v-if="polynomial" v-on:click="insertidentity(factorindex,0)"> ...+</button>
              </div>
              <div v-else class="sign">
                <span v-if="degrees[factorindex]!=matrixindex-1 && polynomial">t<sup  v-html="degrees[factorindex]-matrixindex+1"></sup>
                </span>
                <button v-if="false&&polynomial" v-on:click="insertidentity(factorindex,matrixindex)"> +</button>
                +
              </div>
          
              <div style="float:left;width=100%">
                <div><button v-if="polynomial&&factor.length>1&&(matrixindex==0 || matrixindex==factor.length-1)" v-on:click="deletematrix(factorindex,matrixindex)">Delete me</button>
                <button v-if="!polynomial&&(factorindex==0||factorindex==matrices.length-1)" v-on:click="deletefactor(factorindex)">Delete me</button>
                </div>
                    <div v-for="(column,columnindex) in matrix" class = "column">
                      <span v-for="(entry,entryindex) in column">
                        <div>
                          <input class = "entry regularbox" v-model="matrices[factorindex][matrixindex][columnindex][entryindex]" >
                          </input>
                        </div>
                      </span>
                    </div>
                </div>
                  <div v-if = "matrixindex==factor.length-1" class="sign">
                  <span v-if="degrees[factorindex]!=matrixindex">
                  ·t<sup v-html="degrees[factorindex]-matrixindex"></sup>
                  </span>
                  <button v-if="polynomial" v-on:click="appendzero(factorindex)"> +...</button>
                </div>     
              </div>
            </div>
          </div>
      
    </div>
   
  <div style="width:1000px;height:50px;float:top;margin-top:400px;position:absolute;font-weight:900;color:red;font-size:30px;margin-left:100px" v-if="lock">{{superstatus}}</div>
  <div style="width:1000px;float:top;margin-top:260px" v-if="lock">Expression: {{currentscript}}</div>
  <div style="width:1000px;float:top;margin-top:40px" v-if="lock&&history.length>1">Operation: {{cha}}</div>
  <!--div style="width:1000px;float:top;margin-top:20px" v-if="lock&&history.length>1">Matrices in Storage: {{storagematrix}}</div-->
  </div>
`,
  updated(){
	this.$nextTick(function() {
						 MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
					 });
  },
  watch:{
		matrices:function(){
        		this.init()
		}
	},
  mounted: function() {
    this.init()
	console.log(this.showfraction(2,[1,3,4]))
	console.log(this.showfraction(2,[1,-1,1,0,5]))
	console.log(this.showfraction(8,[-1,1,1,0,0]))
	},
  methods: { 
    ispasteavailable(){
	    if(localStorage.matrix==undefined||localStorage.matrix==""||localStorage.matrix=="[]"){
		    return false
	    }else{
		    return true
	    }
    },
    issquarematrix(){
	    if(this.ispasteavailable()){
		    var pastematrix = JSON.parse(localStorage.matrix)
		    if(pastematrix[0].length==pastematrix.length){
			    return true
		    }else{
			    return false
		    }
	    }else{
		    return false
	    }
    },
    appendable(){
	    if(this.ispasteavailable()){
		    var pastematrix = JSON.parse(localStorage.matrix)
		    if(pastematrix.length==this.countrows(0)){
			    return true
		    }else{
			    return false
		    }
	    }else{
		    return false
	    }
    },
    prependable(){
	    if(this.ispasteavailable()){
		    var pastematrix = JSON.parse(localStorage.matrix)
		    if(pastematrix[0].length==this.countcols(this.signs.length-1)){
			    return true
		    }else{
			    return false
		    }
	    }else{
		    return false
	    }
    },
    copymatrix(factorindex,matrixindex){		    
	    localStorage.matrix = JSON.stringify(this.matrices[factorindex][matrixindex])
		    this.superstatus='Copy successful'
    },
    click(){
      this.status="you want to divide by something?"

      if(this.fromcolumn==-1 && this.fromfactorindex>=0 && this.fromfactorindex<this.matrices.length){//rowdividing
        count = 0
        sca = 0
        posa = -1
	firstnonzero = 0//first non zero entry
        totalrowlength = this.matrices[this.fromfactorindex][0].length
        for(jia = 0; jia<totalrowlength; jia++){
          tempsca = this.matrices[this.fromfactorindex][this.frommatrixindex][jia][this.fromrow]
          if(tempsca!=0){
		if(firstnonzero==0){
			firstnonzero = tempsca
		}
             count = count +1
             sca = tempsca
             posa = jia
          }
        }
        if(count==0&&this.polynomial){
          //polynomial mode


          if( this.frommatrixindex+1==this.matrices[this.fromfactorindex].length && this.frommatrixindex!=0 ){// dividing t
          cofactorindex = this.fromfactorindex + 2*this.signs[this.fromfactorindex] - 1
            if(cofactorindex>=0&&cofactorindex<this.matrices.length){//actual 
              fafa = this.fromfactorindex
              roro = this.fromrow
              this.rowDividingT(fafa,roro)
              this.rowDividingT(cofactorindex,roro)
              this.completematrix()
              this.status="Row multiplying performed. Divide the row "+roro+" by t"
              this.symbol="r_"+(roro+1)+"\\mapsto r_"+(roro+1)+"\\times \\frac1t"
             this.refresh()
            }

          }
          if( this.frommatrixindex==0 && this.frommatrixindex+1!=this.matrices[this.fromfactorindex].length  ){// multiply t
          cofactorindex = this.fromfactorindex + 2*this.signs[this.fromfactorindex] - 1
            if(cofactorindex>=0&&cofactorindex<this.matrices.length){//actual code
              fafa = this.fromfactorindex
              roro = this.fromrow
              this.rowMultiplyingT(fafa,roro)
              this.rowMultiplyingT(cofactorindex,roro)
              this.completematrix()
              this.status="Row multiplying performed. Multiply the row "+roro+" by t"
              this.symbol="r_"+(roro+1)+"\\mapsto r_"+(roro+1)+"\\times t"
             this.refresh()

            }

          }
          


        }else{
          if(count >= 1){// dividing by the unique scalar // later on I change count ==1 to count >=1
		  sca = firstnonzero // I add this to hack! oh.
              cofactorindex = this.fromfactorindex + 2*this.signs[this.fromfactorindex] - 1
            if(cofactorindex>=0&&cofactorindex<this.matrices.length){
              if(sca!=1){
                this.rowMultiplying(this.fromfactorindex,this.fromrow,sca)
                this.rowMultiplying(cofactorindex,this.fromrow,sca)
                this.status="Row multiplying performed. Divide the row "+this.fromrow+" by "+sca
              	this.symbol="r_"+(this.fromrow+1)+"\\mapsto r_"+(this.fromrow+1)+"\\times \\frac1{"+sca+"}"
             this.refresh()
              }else{
                if(this.polynomial&& this.matrices[this.fromfactorindex].length >1 &&this.frommatrixindex==this.matrices[this.fromfactorindex].length-1){//dividing 
                    co = 1 // 一开始的时候是乘以(1+t) co 代表t的指数
                    hi = this.matrices[this.fromfactorindex].length-2
                    colama = posa
                    rowma = this.fromrow
                    

                    while(hi>=0 && this.matrices[this.fromfactorindex][hi][colama][rowma]==0 ){
                      
                      hi = hi-1
                      co = co+1
                    }
                    
                    if(hi>=0){
                      gaga = this.matrices[this.fromfactorindex][hi][colama][rowma]
                      gaga = math.fraction(gaga)
                      gaga = -gaga
                      
                      // this part is too troublesome, I have never succssfully test this out.
                      frama = this.fromfactorindex
                      rora = this.fromrow
                      this.status = "prepare to add hi ="+hi+"co="+co
                      this.rowAddingT(frama,rora,co,gaga)
                      this.rowAddingT(cofactorindex,rora,co,gaga)
                      this.status = "Multiply the row"+this.fromrow+" by 1+t times"+gaga
              		this.symbol="r_"+(this.fromrow+1)+"\\mapsto r_"+(this.fromrow+1)+"\\times (1+"+gaga+"t)"
             this.refresh()
                    }

                }
              }
            }
          }else{
		if(this.polynomial){
   		         this.status="You are not allowed to divide the row until there is only 1 non-zero element."
		}else{
			//row dividing. 
		}
          }
        }


      }else{
        if(this.fromrow==-1){//column dividing
           count = 0
           sca = 0
           posa = -1
	   firstnonzero = 0
           totalcollength = this.matrices[this.fromfactorindex][0][0].length
            for(jia = 0; jia<totalcollength; jia++){
              tempsca = this.matrices[this.fromfactorindex][this.   frommatrixindex][this.fromcolumn][jia]
              if(tempsca!=0){
		      if(firstnonzero==0){
			      firstnonzero = tempsca
		      }
                 count = count +1
                 sca = tempsca
                 posa = jia
              }
           }
            if(count==0&&this.polynomial){//polynomial mode

             if( this.frommatrixindex+1==this.matrices[this.fromfactorindex].length && this.frommatrixindex!=0 ){// dividing t
          cofactorindex = this.fromfactorindex - 2*this.signs[this.fromfactorindex] + 1
            if(cofactorindex>=0&&cofactorindex<this.matrices.length){//actual 
              fafa = this.fromfactorindex
              roro = this.fromcolumn
              this.colDividingT(fafa,roro)
              this.colDividingT(cofactorindex,roro)
              this.completematrix()
              this.status="Column multiplying performed. Divide the column "+roro+" by t"
              		this.symbol="c_"+(roro+1)+"\\mapsto c_"+(roro+1)+"\\times \\frac1t"
             this.refresh()
            }

          }
          if( this.frommatrixindex==0 && this.frommatrixindex+1!=this.matrices[this.fromfactorindex].length  ){// multiply t
          cofactorindex = this.fromfactorindex - 2*this.signs[this.fromfactorindex] + 1
            if(cofactorindex>=0&&cofactorindex<this.matrices.length){//actual code
              fafa = this.fromfactorindex
              roro = this.fromcolumn
              this.colMultiplyingT(fafa,roro)
              this.colMultiplyingT(cofactorindex,roro)
              this.completematrix()
              this.status="Column multiplying performed. Multiply the column "+roro+" by t"
              		this.symbol="c_"+(roro+1)+"\\mapsto c_"+(roro+1)+"\\times t"
             this.refresh()

            }

          }

            }else{
              if(count >= 1){// dividing by the unique scalar
		      sca = firstnonzero
              cofactorindex = this.fromfactorindex - 2*this.signs[this.fromfactorindex] + 1
                if(cofactorindex>=0&&cofactorindex<this.matrices.length){
                  if(sca!=1){
                   this.colMultiplying(this.fromfactorindex,this.fromcolumn,sca)
                    this.colMultiplying(cofactorindex,this.fromcolumn,sca)
                    this.status="Column multiplying performed. Divide the column "+this.fromcolumn+" by "+sca
              	this.symbol="c_"+(this.fromcolumn+1)+"\\mapsto c_"+(this.fromcolumn+1)+"\\times \\frac1{"+sca+"}"
             this.refresh()
                  }else{
                      if(this.polynomial&& this.matrices[this.fromfactorindex].length >1 &&this.frommatrixindex==this.matrices[this.fromfactorindex].length-1){//dividing 
                      co = 1 // 一开始的时候是乘以(1+t) co 代表t的指数
                     hi = this.matrices[this.fromfactorindex].length-2
                     colama = this.fromcolumn
                       rowma = posa
                    

                       while(hi>=0 && this.matrices[this.fromfactorindex][hi][colama][rowma]==0 ){
                      
                         hi = hi-1
                         co = co+1
                      }
                      
                      if(hi>=0){
                        gaga = this.matrices[this.fromfactorindex][hi][colama][rowma]
                        gaga = math.fraction(gaga)
                          gaga = -gaga
                      
                      // this part is too troublesome, I have never succssfully test this out.
                      frama = this.fromfactorindex
                      rora = this.fromcolumn
                      this.status = "prepare to add hi ="+hi+"co="+co
                      this.colAddingT(frama,rora,co,gaga)
                      this.colAddingT(cofactorindex,rora,co,gaga)
                      this.status = "Multiply the column"+this.fromcolumn+" by 1+t times"+gaga
              		this.symbol="c_"+(this.fromcolumn+1)+"\\mapsto c_"+(this.fromcolumn+1)+"\\times (1+"+sca+"t)"
             this.refresh()
                    }

                }




                  }
                }
              }else{
		if(this.polynomial){
   		         this.status="You are not allowed to divide the row until there is only 1 non-zero element."
		}else{
			//column dividing. 
		}
              }
            }


        }
      }
      //console.log([this.fromfactorindex,this.frommatrixindex,this.fromcolumn,this.fromrow])
      //console.log(this.apbl('3','2','1/3'))
      //console.log(this.divide('3','2'))
    },
    initializefromto(){
       this.frommatrixindex=-1
       this.fromfactorindex=-1
       this.fromrow=-1
       this.fromcolumn=-1
       this.tomatrixindex=-1
       this.tofactorindex=-1
       this.torow=-1
       this.tocolumn=-1
    },
    tesla(event,factorindex,matrixindex,col,row){
      event.preventDefault()
      this.fromcolumn = col
      this.frommatrixindex = matrixindex
      this.fromfactorindex=factorindex
      this.fromrow=row
    },
    mouseovercol(factorindex,matrixindex,col,row){
      this.fromcolumn = col
      this.frommatrixindex = matrixindex
      this.fromfactorindex=factorindex
      this.fromrow=row
      this.tocolumn = -1
      this.tomatrixindex = matrixindex
      this.tofactorindex=factorindex
      this.torow=-1
    },
    allowdrop(event,factorindex,matrixindex,col,row){
      event.preventDefault()
      this.tocolumn = col
      this.tomatrixindex = matrixindex
      this.tofactorindex=factorindex
      this.torow=row
    },
    drop(event,factorindex,matrixindex,col,row){
      event.preventDefault()
      if(this.frommatrixindex>=0&&this.fromfactorindex>=0&&matrixindex>=0&&factorindex>=0){
        if(this.fromrow>=0&&row>=0&&this.fromcolumn>=0&&col>=0)
        {
          if(this.fromfactorindex==factorindex&&this.frommatrixindex==matrixindex){
               fromnumber = this.matrices[this.fromfactorindex][this.frommatrixindex][this.fromcolumn][this.fromrow]
              tonumber = this.matrices[factorindex][matrixindex][col][row]
              if(fromnumber!=0){
                  tempscalar = math.fraction(this.divide(tonumber,fromnumber))
              }else{
                  tempscalar = math.fraction('0')
              }
              scalar=math.floor(tempscalar)
              if(scalar==0){
                if(tempscalar.d!=1){
                  scalar = -tempscalar.s*tempscalar.n+"/"+tempscalar.d
                }
              }else{
                scalar = -scalar
              } 
              if(this.fromcolumn==col&&this.fromrow!=row){//rowoperations
                  cofactorindex = factorindex + 2*this.signs[factorindex] - 1
                  if(cofactorindex>=0&&cofactorindex<this.matrices.length){
                    this.rowAdding(factorindex,row,this.fromrow,scalar)
                    this.rowAdding(cofactorindex,row,this.fromrow,scalar)
                    this.status="Row operations performed: Row"+(row+1)+" plus "+scalar+" times row "+ (this.fromrow+1)+". Nice job."
                    this.symbol="r_{"+(row+1)+"}\\mapsto r_{"+(row+1)+"}+"+scalar+" \\times r_"+ (this.fromrow+1)
             this.refresh()
                    }
              }
              if(this.fromrow==row&&this.fromcolumn!=col){//column operations
                  cofactorindex = factorindex - 2*this.signs[factorindex] + 1
                  if(cofactorindex>=0&&cofactorindex<this.matrices.length){
                    colnima = this.fromcolumn
                    this.colAdding(factorindex,col,colnima,scalar)
                    this.colAdding(cofactorindex,col,colnima,scalar)
                    
                    this.status="Column operations performed: Column"+(col+1)+" plus "+scalar+" times column "+ (this.fromcolumn+1)+". Nice job."
                    this.symbol="c_{"+(col+1)+"}\\mapsto c_{"+(col+1)+"}+"+scalar+" \\times c_"+ (this.fromcolumn+1)
             this.refresh()
                    }
              }
          }
        }
        else{
           if(this.fromrow==-1&&this.torow==-1){
             if(this.fromcolumn!=col){
                  cofactorindex = factorindex - 2*this.signs[factorindex] + 1
                  if(cofactorindex>=0&&cofactorindex<this.matrices.length){
                    this.colSwitching(factorindex,col,this.fromcolumn)
                    this.colSwitching(cofactorindex,col,this.fromcolumn)
                    this.status="Column operations performed: Switch column"+(col+1)+" with column"+ (this.fromcolumn+1)+". Nice job."
                    this.symbol="c_{"+(col+1)+"}\\leftrightarrow c_{"+ (this.fromcolumn+1)+"}"
             this.refresh()
                    }
              }

            }
            if(this.fromcolumn==-1&&this.tocolumn==-1){
              if(this.fromrow!=row){
                  cofactorindex = factorindex + 2*this.signs[factorindex] - 1
                  if(cofactorindex>=0&&cofactorindex<this.matrices.length){
                    this.rowSwitching(factorindex,row,this.fromrow)
                    this.rowSwitching(cofactorindex,row,this.fromrow)
                    this.status="Row operations performed: Switch row"+(row+1)+" with row "+ (this.fromrow+1)+". Nice job."
                    this.symbol="r_{"+(row+1)+"}\\leftrightarrow r_{"+ (this.fromrow+1)+"}"
             this.refresh()
                    }
              }

            }
        }
          
        this.initializefromto()
      }
    },
        testdrop(event,a,b){
          event.preventDefault();
          },
        changedegree(position,value){this.degrees.splice(0,1,3);alert(this.degrees)},
        init(){},
        appendzero(position){
            rows = this.countrows(position)
            cols = this.countcols(position)
            this.matrices[position].push(this.giveZeroMatrix(rows,cols))
        },
        insertzero(position,index){
            rows = this.countrows(position)
            cols = this.countcols(position)
            this.matrices[position].splice(index,0,this.giveZeroMatrix(rows,cols))
            if(index==0){
              this.degrees[position] = this.degrees[position]+1
            }
        },
	insertidentity(position,index){
            rows = this.countrows(position)
            cols = this.countcols(position)
            this.matrices[position].splice(index,0,this.giveIdentityMatrix(rows,cols))
            if(index==0){
              this.degrees[position] = this.degrees[position]+1
            }
        },
        completematrix(){
          for(position=0;position<this.matrices.length;position++){
            
            
            while(this.matrices[position].length<=this.degrees[position]){
                this.appendzero(position)
            }
            //while(this.isZeroMatrix(this.matrices[position][0])&&this.degrees[position]>0){
             // this.matrices[position]=this.matrices[position].splice(1)
              //this.degrees[position] = this.degrees[position]-1
            //}
            while(this.isZeroMatrix(this.matrices[position][this.matrices[position].length-1])&&this.matrices[position].length>this.degrees[position]+1){
                this.matrices[position].pop()
            }
          }
        },
	refresh(){
		this.lock = false
                this.$nextTick(()=>{this.lock = true})
		this.record()
		//console.log(this.showasmatrix(this.matrices[0],this.degrees[0]))
		scaca = this.showscript()
		this.script.push(scaca)
		this.steps.push(this.symbol)
		this.lastscr = this.currentscr
		this.currentscr = scaca
		this.currentscript = "$$"+scaca+"$$"
		this.cha = "$$"+ this.lastscr + "\\overset{"+this.symbol+"}{=\\mathrel{\\mkern-3mu}=\\mathrel{\\mkern-3mu}=\\mathrel{\\mkern-3mu}=\\mathrel{\\mkern-3mu}=\\mathrel{\\mkern-3mu}=\\mathrel{\\mkern-3mu}=\\mathrel{\\mkern-3mu}=}" + this.currentscr+"$$"
		//this.storagematrix = 
		//\\overset{\\mathrm{fefe}}{=\\mathrel{\\mkern-3mu}=}
	},
        startMatrix(height,width){},
        insertMatrix(position,size){},
        falsify(){
          this.appendbutton=false
          this.prependbutton=false
          this.newmatrix=false
        },
        appendfactor(row,col,sign,paste=false){
	  var thematrix = []
	  if(paste){
		  thematrix = JSON.parse(localStorage.matrix)
	  }else{
		  if(sign||row==col){
			  thematrix = this.giveIdentityMatrix(row,col)
		  }else{
			  thematrix = this.giveZeroMatrix(row,col)
		  }
	  }
	  this.matrices.splice(0,0,[thematrix])
    //      if(sign){
      //      this.matrices.splice(0,0,[this.giveIdentityMatrix(row,col)])
//          }else{
//		if(row==col){
  //          		this.matrices.splice(0,0,[this.giveIdentityMatrix(row,col)])
//		}else{
  //          		this.matrices.splice(0,0,[this.giveZeroMatrix(row,col)])
//		}
  //        }
          this.signs.splice(0,0,sign)
          this.degrees.splice(0,0,0)
          this.falsify()
        },
        prependfactor(row,col,sign,paste=false){
	  var thematrix = []
	  if(paste){
		  thematrix = JSON.parse(localStorage.matrix)
	  }else{
		  if(sign||row==col){
			  thematrix = this.giveIdentityMatrix(row,col)
		  }else{
			  thematrix = this.giveZeroMatrix(row,col)
		  }
	  }
	  this.matrices.push([thematrix])
//          if(sign){
  //          this.matrices.push([this.giveIdentityMatrix(row,col)])
//          }else{
//          	if(row==col){
//            		this.matrices.push([this.giveIdentityMatrix(row,col)])
//		}else{
//            		this.matrices.push([this.giveZeroMatrix(row,col)])
//		}
//          }
          this.signs.push(sign)
          this.degrees.push(0)
          this.falsify()
        },
        inverseMatrix(position){},
        deletefactor(factorindex){
          this.matrices.splice(factorindex,1)
          this.degrees.splice(factorindex,1)
          this.signs.splice(factorindex,1)
        },
        deletematrix(position,index){
          this.matrices[position].splice(index,1)
          if(index==0){
            this.degrees[position]=this.degrees[position]-1
          }
        },
        changeEntry(position,row,col,entry){},
        saveMatrices(){},
        loadMatrices(){},
        lockMatrices(){},
        unlockMatrices(){},
        rowAdding(position,rowa,rowb,scalar,callback=function(a,b){}){
          this.matrices[position].forEach(matrix=>{
            matrix.forEach(column=>{
              aa = column[rowa]
              bb = column[rowb]
 
                column.splice(rowa,1,this.apbl(aa,bb,scalar))
            })
          })
        },
        rowEchlonAdding(position,rowa,rowb,scalar,callback){},
        rowSwitching(position,rowa,rowb,callback=function(a,b){}){
            this.matrices[position].forEach(matrix=>{
            matrix.forEach(column=>{
              tempnumber = column[rowa]
              column.splice(rowa,1,column[rowb])
              column.splice(rowb,1,tempnumber)
            })
          })
        },
        rowMultiplying(position,row,scalar,callback=function(a,b){}){
          this.matrices[position].forEach(matrix=>{
            matrix.forEach(column=>{
              tempnumber = this.divide(column[row],scalar)
              column.splice(row,1,tempnumber)
            })
          })
        },
        rowDividingT(position,row){
            numbers = this.matrices[position].length
            cool = this.matrices[position][0].length // number of columns in a matrix
            roow = this.matrices[position][0][0].length
            this.matrices[position].push(this.giveZeroMatrix(roow,cool))
            for(ji = numbers;ji>0;ji--){
              for(mei = 0;mei<cool;mei++){
                this.matrices[position][ji][mei][row] = this.matrices[position][ji-1][mei][row]
              }
            }
            for(mei = 0;mei<cool;mei++){
                this.matrices[position][0][mei][row] = 0
              }
        },
        rowMultiplyingT(position,row){
            numbers = this.matrices[position].length
            cool = this.matrices[position][0].length // number of columns in a matrix
            roow = this.matrices[position][0][0].length
            this.matrices[position].splice(0,0,this.giveZeroMatrix(roow,cool))
            for(ji = 0;ji<numbers;ji++){
              for(mei = 0;mei<cool;mei++){
                this.matrices[position][ji][mei][row] = this.matrices[position][ji+1][mei][row]
              }
            }
            for(mei = 0;mei<cool;mei++){
                this.matrices[position][numbers][mei][row] = 0
              }
            if(this.isZeroMatrix(this.matrices[position][0])){
              this.matrices[position].splice(0,1)
            }else{
              this.degrees[position] = this.degrees[position]+1
            }
        },
        rowAddingT(position,row,shift,scalar){
            numbers = this.matrices[position].length
            cool = this.matrices[position][0].length 
            roow = this.matrices[position][0][0].length
            for(dog=0;dog<shift;dog++){
                this.matrices[position].splice(0,0,this.giveZeroMatrix(roow,cool))
            }
            
            for(ji = 0;ji<numbers;ji++){
              for(mei = 0;mei<cool;mei++){
                this.matrices[position][ji][mei][row] = this.apbl(this.matrices[position][ji][mei][row],this.matrices[position][ji+shift][mei][row],scalar)
              }
              
            }
            patience = shift
            while(this.isZeroMatrix(this.matrices[position][0]) && patience > 0)
            {
                  this.matrices[position].splice(0,1)
                  patience = patience - 1
            }
            this.degrees[position] = this.degrees[position]+patience
        },
       colAddingT(position,col,shift,scalar){
            numbers = this.matrices[position].length
            cool = this.matrices[position][0].length 
            roow = this.matrices[position][0][0].length
            for(dog=0;dog<shift;dog++){
                this.matrices[position].splice(0,0,this.giveZeroMatrix(roow,cool))
            }
            
            for(ji = 0;ji<numbers;ji++){
              for(mei = 0;mei<roow;mei++){
                this.matrices[position][ji][col][mei] = this.apbl(this.matrices[position][ji][col][mei],this.matrices[position][ji+shift][col][mei],scalar)
              }
              
            }
            patience = shift
            while(this.isZeroMatrix(this.matrices[position][0]) && patience > 0)
            {
                  this.matrices[position].splice(0,1)
                  patience = patience - 1
            }
            this.degrees[position] = this.degrees[position]+patience
        },
        colDividingT(position,col){
            numbers = this.matrices[position].length
            cool = this.matrices[position][0].length // number of columns in a matrix
            roow = this.matrices[position][0][0].length
            this.matrices[position].push(this.giveZeroMatrix(roow,cool))
            for(ji = numbers;ji>0;ji--){
              for(mei = 0;mei<roow;mei++){
                this.matrices[position][ji][col][mei] = this.matrices[position][ji-1][col][mei]
              }
            }
            for(mei = 0;mei<cool;mei++){
                this.matrices[position][0][col][mei] = 0
              }
        },
        colMultiplyingT(position,col){
            numbers = this.matrices[position].length
            cool = this.matrices[position][0].length // number of columns in a matrix
            roow = this.matrices[position][0][0].length
            this.matrices[position].splice(0,0,this.giveZeroMatrix(roow,cool))
            for(ji = 0;ji<numbers;ji++){
              for(mei = 0;mei<roow;mei++){
                this.matrices[position][ji][col][mei] = this.matrices[position][ji+1][col][mei]
              }
            }
            for(mei = 0;mei<cool;mei++){
                this.matrices[position][numbers][col][mei] = 0
              }
            if(this.isZeroMatrix(this.matrices[position][0])){
              this.matrices[position].splice(0,1)
            }else{
              this.degrees[position] = this.degrees[position]+1
            }
        },
        colAdding(position,cola,colb,scalar,callback=function(a,b){}){
            this.matrices[position].forEach(matrix=>{
              aaaa = matrix[cola]
              bbbb = matrix[colb]
              cccc = []
              for(i=0;i<aaaa.length;i++){
                cccc.push(this.apbl(aaaa[i],bbbb[i],scalar))
              }
              matrix[cola] = cccc
          })
        },
        colEchlonAdding(position,cola,colb,scalar,callback){},
        colSwitching(position,cola,colb,callback=function(a,b){}){
          this.matrices[position].forEach(matrix=>{
              aaaa = matrix[cola]
              bbbb = matrix[colb]
              for(i=0;i<aaaa.length;i++){
                temptemp = aaaa[i]
                aaaa.splice(i,1,bbbb[i])
                bbbb.splice(i,1,temptemp)
              }
          })
        },
        colMultiplying(position,col,scalar,callback=function(a,b){}){
          this.matrices[position].forEach(matrix=>{
            cococo = matrix[col]
            for(jiji = 0; jiji<cococo.length; jiji++){
              tete = this.divide(cococo[jiji],scalar)
              cococo.splice(jiji,1,tete)
            }
          })
        },
        apbl(a,b,lambda){
          aa = math.fraction(a)
          bb = math.fraction(b)
          ll = math.fraction(lambda)
          rr = math.add(aa,math.multiply(bb,ll))
          if(rr.n==0){
            return "0"
          }
          if(rr.d==1){
            return rr.s*rr.n
          }else{
            return rr.s*rr.n+"/"+rr.d
          }
        },
        divide(a,b){
          aa = math.fraction(a)
          bb = math.fraction(b)
          rr = math.divide(aa,bb)
          if(rr.d==1){
            return rr.s*rr.n
          }else{
            return rr.s*rr.n+"/"+rr.d
          }
        },
	record(){
		this.history.push(JSON.stringify([this.matrices,this.signs,this.degrees]))
		console.log(this.history)
	},
        goback(){
		this.history.pop()
		lid = this.history.pop()
		record = JSON.parse(lid)
		//console.log("goback")
		//console.log(record)
		//console.log(record.pop())
		//console.log(record.pop())
		//console.log(record.pop())
		this.degrees = record.pop()
		//console.log("degree")
		//console.log(record[2])
		this.signs = record.pop()
		this.matrices = record.pop()
		this.steps.pop()
		this.symbol = this.steps.pop()
		this.script.pop()
		leng = this.script.length
		if(leng>1){
		this.currentscr = this.script[leng-2]
		}
	//	this.history.push(lid)
//		console.log(this.matrices)
//		console.log(this.signs)
//		console.log(this.degrees)
	//	this.currentscript="$$$$"
	//	this.currentscript = "$$"+this.showscript()+"$$"
		this.refresh()
	},
        rowOperatable(position){},
        colOperatable(position){},
        countrows(position){
            if(this.matrices[position].length==0){return 0}
            else{
              return this.matrices[position][0][0].length
            }
        },
        countcols(position){
            if(this.matrices[position].length==0){return 0}
            else{
              return this.matrices[position][0].length
            }
        },
        giveZeroMatrix(rows,cols){
            sum = []
          	for (i=0;i<cols;i++){
		              column = []
		              for(j=0;j<rows;j++){
			                  column.push(0)
		                }
		                sum.push(column)
              }
            	return sum
        },
        giveIdentityMatrix(rows,cols){
            sum = []
          	for (i=0;i<cols;i++){
		              column = []
		              for(j=0;j<rows;j++){
                    if(i==j){
			                  column.push(1)
                        }
                        else{
                          column.push(0)
                        }
		                }
		                sum.push(column)
              }
            	return sum
        },
        isZeroMatrix(matrix){
	            var flagi = true
	            matrix.forEach(columns=>{
		                columns.forEach(entry=>{
			                  if(entry!=0){flagi = false}
		                  })
	              })
	            return flagi
      },
	showscript(){
		lan = this.matrices.length
		script = ""
		for (iu = 0;iu<lan;iu++){
			script=script+this.showasmatrix(this.matrices[iu],this.degrees[iu])
			if(this.signs[iu]){
				script=script+"^{-1}"
			}
		}
		return script
	},
	showasmatrix(mata,degree){
		lena = mata.length
		sumi = "\\begin{pmatrix}"
		if(lena>0){
			colsa = mata[0].length
			if(colsa > 0){
				rowsa = mata[0][0].length
			}
		}
		for (mia = 0; mia<rowsa; mia++){
			yaya = false
			for(ca = 0; ca<colsa; ca++){
				if(yaya){
					sumi = sumi + "&"
				}
				yasi = []
				for(lu = lena-1; lu>=0;lu--){	
					yasi.push(mata[lu][ca][mia])
					
				}
				fra = this.showfraction(degree,yasi)
				sumi = sumi + fra
				//console.log("degree="+degree)
				//console.log(fra)
				yaya = true
			}
			sumi = sumi + "\\\\"
		}
		sumi = sumi + "\\end{pmatrix}"
		return sumi
	},
	showfraction(degree,list){
		d = degree
		sum=""
		while(list.length>0){
//			if(d<0){
//				pre = "\\frac{"
//				if(d==-1){
//					after = "}t"
//				}else{
//					after="}{t^"+(-d)+"}"
//				}
//			}else{
//				if(d==0)
//				{
//					pre=""
//					after=""
//				}else{
//					if(d==1){
//						pre=""
//						after = "t"
//					}else{
//						pre=""
//						after = "t^{"+d+"}"
//					}
//				}
//			}
			number = list.pop()
			frac = math.fraction(number)
				if(sum!=""){
						addition = "+"
					}else{
						addition = ""
					}
				if(frac>0){
					if(frac==1){
						if(d>=0){
							if(d>1){
								sum = sum+addition + "t^{"+d+"}"
							}else{
								if(d==1){
									sum = sum+addition + "t"
								}else{
									sum = sum+addition + "1"
								}
							}
						}else{
							if(d==-1){
								sum = sum+addition+"\\frac1"+"{t}"
							}else{
								sum = sum+addition+"\\frac1"+"{t^{"+(-d)+"}}"
							}
						}
						
					}else{
						if(frac.d==1){
							if(d>=0){
								if(d>1){
									sum = sum+addition+frac.n+"t^{"+d+"}"
								}else{
									if(d==1){
										sum = sum+addition+frac.n+"t"
									}else{
										sum = sum+addition+frac.n // case d = 0
									}
								}
							}else{
								if(d==-1){
									sum = sum+addition+"\\frac{"+frac.n+"}{t}"
								}else{
									sum = sum+addition+"\\frac{"+frac.n+"}{t^{"+(-d)+"}}"
								}
							}
						}else{
							if(d>=0){
								if(d>1){
									sum = sum+addition+"\\frac{"+frac.n+"}{"+frac.d+"}t^{"+d+"}"
								}else{
									if(d==1){
										sum = sum+addition+"\\frac{"+frac.n+"}{"+frac.d+"}t"
									}else{
										sum = sum+addition+"\\frac{"+frac.n+"}{"+frac.d+"}"
									}
								}
							}else{
								if(d==-1){
									sum = sum+addition+"\\frac{"+frac.n+"}{"+frac.d+"t}"
								}else{
									sum = sum+addition+"\\frac{"+frac.n+"}{"+frac.d+"t^{"+(-d)+"}}"
								}
							}
						}
					}
				}else{
					if(frac<0){
						if(frac==-1){
							if(d>=0){
								if(d>1){
									sum = sum+"-t^{"+d+"}"
								}else{
									if(d==1){
										sum = sum+"-t"
									}else{
										sum = sum+"-1"
									}
								}
									}else{
								if(d==-1){
									sum = sum+"-\\frac1"+"{t}"
								}else{
									sum = sum+"-\\frac1"+"{t^{"+(-d)+"}}"
								}
							}
						}else{
							if(frac.d==1){
								if(d>=0){
									if(d>1){
										sum = sum+"-"+frac.n+"t^{"+d+"}"
									}else{
										if(d==1){
											sum = sum+"-"+frac.n+"t"
										}else{
										sum = sum+"-"+frac.n
										}
									}
								}else{
									if(d==-1){
										sum = sum+"-\\frac{"+frac.n+"}{t}"
									}else{
										sum = sum+"-\\frac{"+frac.n+"}{t^{"+(-d)+"}}"
									}
								}
							}else{
								if(d>=0){
									if(d>1){
										sum = sum+"-\\frac{"+frac.n+"}{"+frac.d+"}t^{"+d+"}"
									}else{
										if(d==1){
											sum = sum+"-\\frac{"+frac.n+"}{"+frac.d+"}t"
										}else{
											sum = sum+"-\\frac{"+frac.n+"}{"+frac.d+"}"
										}
									}
								}else{
									if(d==-1){
									sum = sum+"-\\frac{"+frac.n+"}{"+frac.d+"t}"
									}else{
									sum = sum+"-\\frac{"+frac.n+"}{"+frac.d+"t^{"+(-d)+"}}"
									}
								}
							}
						}
					}else{
						if(frac==0){
						}else{
							sum = sum+addition +"("+frac+")"
						}
					}
				}

			
			d = d-1

		}
		if(sum==""){
			return "0"
		}
		return sum
	}
  }
})

var app = new Vue({
  el:'#app',
  data:{
  }
})
