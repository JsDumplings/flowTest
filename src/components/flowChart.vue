<template>
<div class="flow-chart">
  <div class="flow-container">
    <div class="left-container">
      <p class="title">控件区</p>
      <div class="content">
        <div class="dnd-container">
          <div data-type="circle" class="dnd-circle" @mousedown="startDrag"></div>
          <p>起点</p>
        </div>
        <div class="dnd-container">
          <img data-type="filter" class="dnd-img" @mousedown="startDrag" src="../assets/filter.svg" alt="" width="50" height="50">
          <p>过滤</p>
        </div>
        <div class="dnd-container">
          <img data-type="group" class="dnd-img" @mousedown="startDrag" src="../assets/group.svg" alt="" width="50" height="50">
          <p>分组</p>
        </div>
        <div class="dnd-container">
          <img data-type="sort" class="dnd-img" @mousedown="startDrag" src="../assets/sort.svg" alt="" width="50" height="50">
          <p>排序</p>
        </div>
        <div class="dnd-container">
          <img data-type="condition" class="dnd-img" @mousedown="startDrag" src="../assets/condition.svg" alt="" width="50" height="50">
          <p>条件</p>
        </div>
        <div class="dnd-container">
          <img data-type="output" class="dnd-img" @mousedown="startDrag" src="../assets/output.svg" alt="" width="50" height="50">
          <p>输出</p>
        </div>
        <div class="dnd-container">
          <img data-type="annotation" class="dnd-img" @mousedown="startDrag" src="../assets/annotation.svg" alt="" width="50" height="50">
          <p>注释</p>
        </div>
      </div>
    </div>
    <div class="center-container">
      <div class="tool-container">
        <div class="title">工具栏</div>
        <div class="tool-content">
          <div class="tool" @click="backoutFuc">
            <img src="../assets/backout.svg" alt="">
            <p>撤销</p>
          </div>
          <div class="tool" @click="recoverFuc">
            <img src="../assets/recover.svg" alt="">
            <p>恢复</p>
          </div>
          <div class="tool" @click="deleteFuc">
            <img src="../assets/delete.svg" alt="">
            <p>删除</p>
          </div>
          <div class="tool">
            <img src="../assets/ligature.svg" alt="">
            <p>连线</p>
          </div>
          <div class="tool">
            <img src="../assets/verify.svg" alt="">
            <p>校验</p>
          </div>
          <div class="tool">
            <img src="../assets/save.svg" alt="">
            <p>保存</p>
          </div>
          <div class="tool">
            <img src="../assets/submit.svg" alt="">
            <p>提交</p>
          </div>
        </div>
      </div>
      <div class="canvas-title">画布区</div>
      <div id="canvas" ref="canvas" class="canvas-container"></div>
    </div>
    <div class="right-container">
      <div :class="{'toolDefault': true,'toolDisabeld':title}">属性区
        <button @click="change()">切换</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Graph, Addon } from '@antv/x6'
import filterSvg from '../assets/filter.svg'
import groupSvg from '../assets/group.svg'
import sortSvg from '../assets/sort.svg'
import conditionSvg from '../assets/condition.svg'
import outputSvg from '../assets/output.svg'
import annotationSvg from '../assets/annotation.svg'
export default {
  name: 'FlowChart',
  data(){
    return{
      data:{
        graph: null, // 画布实例
        dnd: null, // 拖拽实例
        ports: [], // 连接桩定义
        // canundo: false, // 是否可撤销
        // canredo: false, // 是否可恢复
        title:false,
      }
    }
  },
  computed:{
    // toolDisabeld(){
    //   return {
    //     'color':this.canundo ? '#000' : 'gray'
    //   }
    // }
  },
  methods:{
    initGraph(){

      // 画布容器DOM
      const dom = this.$refs['canvas']

      // 画布初始化
      this.graph = new Graph({
        container: dom,
        keyboard: true, // 开启键盘快捷键
        selecting: true, // 开启节点可以被选择
        history: true, // 开启撤销/重做的能力
        width: 500,
        height: 420,
        background:{
          color: '#fffbe6'
        },
        grid:{
          size: 10,
          visible: false
        }
      })

      // 画布上的 删除区域方法delete
      this.graph.bindKey('backspace', () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.removeCells(cells)
        }
      })

      // 显示是否可撤销与恢复
      const history = this.graph.history
      history.on('change', () => {
        console.log('history', this.graph.history)
        this.canundo = history.undoStack ? true : false
        this.canredo = history.redoStack ? true : false
      })

      // 初始化画布数据
      this.graph.fromJSON({})

      // 定义连接桩对象
      this.ports = {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 1,
                fill: '#fff',
              },
            }
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 1,
                fill: '#fff',
              },
            }
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 1,
                fill: '#fff',
              },
            }
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 1,
                fill: '#fff',
              },
            }
          },
        },
        items: [
          {
            group: 'top',
          },
          {
            group: 'right',
          },
          {
            group: 'bottom',
          },
          {
            group: 'left',
          },
        ],
      }

      // 控制连接桩显示/隐藏
      const showPorts = (ports, show) => {
        for (let i = 0, len = ports.length; i < len; i = i + 1) {
          ports[i].style.visibility = show ? 'visible' : 'hidden'
        }
      }
      this.graph.on('node:mouseenter', () => {
        const ports = dom.querySelectorAll(
          '.x6-port-body',
        )
        showPorts(ports, true)
      })
      this.graph.on('node:mouseleave', () => {
        const ports = dom.querySelectorAll(
          '.x6-port-body',
        )
        showPorts(ports, false)
      })

      // 拖拽配置
      const options = {
        target: this.graph,
      }
      this.dnd = new Addon.Dnd(options)
    },
    change(){
      this.title = !this.title
      console.log('this.title', this.title)
    },
    // 工具栏事件
    backoutFuc(){
      // 撤销
      this.graph.history.undo()
      
    },
    recoverFuc(){
      // 恢复
      this.graph.history.redo()
    },
    deleteFuc(){
      // 删除
      const cells = this.graph.getSelectedCells()
      if (cells.length) {
        this.graph.removeCells(cells)
      }
    },
    // 从左侧拖拽的图片绘制到画布区
    drawGraph(img){
      return this.graph.createNode({
        width: 40,
        height: 40,
        markup:[ // 标签结构
          {
            tagName:'image'
          }
        ],
        attrs: {
          image: {
            width: 40,
            height: 40,
            'xlink:href': img,
          },
        },
        ports: {...this.ports}
      })
    },
    // 拖拽事件
    startDrag(e){
      const target = e.currentTarget
      // 通过类型data-type 去判断拖拽的是什么图形
      const type = target.getAttribute('data-type')
      let node = null
      switch(type){
        case 'circle':
          node = this.graph.createNode({
            shape: 'circle',
            width: 30,
            height: 30,
            attrs: {
              body: {
                fill: '#000'
              }
            },
            ports: {...this.ports}
          })
          break
        case 'filter':
          node = this.drawGraph(filterSvg)
          break
        case 'group':
          node = this.drawGraph(groupSvg)
          break
        case 'sort':
          node = this.drawGraph(sortSvg)
          break
        case 'condition':
          node = this.drawGraph(conditionSvg)
          break
        case 'output':
          node = this.drawGraph(outputSvg)
          break
        case 'annotation':
          node = this.drawGraph(annotationSvg)
          break
      }
      console.log(type,'node',node)
      this.dnd.start(node,e)
    }
  },
  mounted(){
    this.initGraph()
  }
}
</script>

<style lang="scss">
@mixin flexRowCen{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
@mixin flexColCen{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.flow-chart{
  .flow-container{
    @include flexRowCen;
    .left-container{
      background-color: aquamarine;
      width: 100px;
      height: 500px;
      .content{
        @include flexRowCen;
        flex-direction: column;
        .dnd-container{
          @include flexRowCen;
          justify-content: space-around;
          width: 80%;
          margin: 15px 0;
          .dnd-circle{
            @include flexRowCen;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #000;
          }
          .dnd-img{
            width: 30px;
            height: 30px;
          }
          p{
            width: 40px;
          }
        }
      }
    }
    .center-container{
      position: relative;
      .tool-container{
        height: 80px;
        width: 100%;
        background-color: aqua;
        .tool-content{
          @include flexRowCen;
          .tool{
            @include flexColCen;
            height: 60px;
            margin: 0 15px;
            justify-content: space-between;
            img{
              width: 30px;
              height: 30px;
            }
            p{
              height: 30px;
              line-height: 30px;
              text-align: center;
            }
          }
        }
      }
      .canvas-title{
        position: absolute;
        top: 90px;
        left: 20px;
        z-index: 2;
      }
      .canvas-container{
        
      }
    }
    .right-container{
      width: 200px;
      height: 500px;
      background-color: cadetblue;
    }
  }
  .toolDisabeld{
    color: gray;
  }
  .toolDefault{
    color: #000;
  }
}
</style>
