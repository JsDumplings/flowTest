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
        <!-- 正式可以写入svg标签 -->
        <div class="tool-content">
          <div class="tool" :class="canundo ? 'toolDefault' : 'toolDisabeld'" @click="backoutFuc">
            <img src="../assets/backout.svg" alt="">
            <p>撤销</p>
          </div>
          <div class="tool" :class="canredo ? 'toolDefault' : 'toolDisabeld'" @click="recoverFuc">
            <img src="../assets/recover.svg" alt="">
            <p>恢复</p>
          </div>
          <div class="tool" @click="deleteFuc">
            <img src="../assets/delete.svg" alt="">
            <p>删除</p>
          </div>
          <!-- <div class="tool">
            <img src="../assets/ligature.svg" alt="">
            <p>连线</p>
          </div> -->
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
      <div>属性区</div>
      <div>{{nodeData}}</div>
      <button @click="submit">提交</button>
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
// import annotationSvg from '../assets/annotation.svg'
export default {
  name: 'FlowChart',
  data(){
    return{
      graph: null, // 画布实例
      dnd: null, // 拖拽实例
      ports: [], // 连接桩定义
      canundo: false, // 是否可撤销
      canredo: false, // 是否可恢复
      nodeData:"", // 节点数据
      idsArr: [[],[],[],[],[],[],[]] // 控件数量
    }
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

      // 显示是否可撤销与恢复
      const history = this.graph.history
      history.on('change', () => {
        this.canundo = history.undoStack.length > 0 ? true : false
        this.canredo = history.redoStack.length > 0 ? true : false
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
      // 鼠标单击空白
      this.graph.on('blank:click', () => {
      })
      // 鼠标双击显示信息
      this.graph.on('cell:dblclick', ({ cell, e }) => {
        this.nodeData = cell.getData()
        const isNode = cell.isNode()
        const name = isNode ? 'node-editor' : 'edge-editor'
        cell.removeTool(name)
        cell.addTools({
          name,
          args: {
            event: e,
            attrs: {
              backgroundColor: isNode ? '#EFF4FF' : '#FFF',
            },
          },
        })
      })
      this.graph.on('cell:removed', ({ cell, index, options }) => {
        console.log('cell', cell)
        console.log('index', index)
        console.log('options', options)
        // e.stopPropagation()
        let data = cell.getData()
        console.log('data', data)
      })

      // 拖拽配置
      const options = {
        target: this.graph,
      }
      this.dnd = new Addon.Dnd(options)
    },
    // 工具栏事件
    backoutFuc(){
      // 撤销
      const history = this.graph.history
      history.undo()
      this.canundo = history.undoStack.length ? true : false
    },
    recoverFuc(){
      // 恢复
      const history = this.graph.history
      history.redo()
      this.canredo = history.redoStack.length ? true : false
    },
    deleteFuc(){
      // 删除
      const cells = this.graph.getSelectedCells()
      if (cells.length) {
        this.graph.removeCells(cells)
      }
    },
    // 从左侧拖拽的图片绘制到画布区
    drawGraph(img,data){
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
        data: data,
        ports: {...this.ports}
      })
    },
    // 拖拽事件
    startDrag(e){
      const target = e.currentTarget
      // 通过类型data-type 去判断拖拽的是什么图形
      const type = target.getAttribute('data-type')
      let data = {}
      let node = null
      switch(type){
        case 'circle': {
          data = {
            name: '起点',
            controlIdx: 0
          }
          node = this.graph.createNode({
            shape: 'circle',
            width: 30,
            height: 30,
            attrs: {
              body: {
                fill: '#000'
              }
            },
            data,
            ports: {...this.ports}
          })
          break;
        }
        case 'filter':
          data = {
            name: '过滤',
            controlIdx: 1
          }
          node = this.drawGraph(filterSvg,data)
          break
        case 'group':
          data = {
            name: '分组',
            controlIdx: 2
          }
          node = this.drawGraph(groupSvg,data)
          break
        case 'sort':
          data = {
            name: '排序',
            controlIdx: 3
          }
          node = this.drawGraph(sortSvg,data)
          break
        case 'condition':
          data = {
            name: '条件',
            controlIdx: 4
          }
          node = this.drawGraph(conditionSvg,data)
          break
        case 'output':
          data = {
            name: '输出',
            controlIdx: 5
          }
          node = this.drawGraph(outputSvg,data)
          break
        case 'annotation': {
          data = {
            name: '注释',
            controlIdx: 6
          }
          node = this.graph.createNode({
            shape: 'rect',
            width: 100,
            height: 40,
            attrs: {
              body: {
                // fill: '#000'
              }
            },
            data,
            ports: {...this.ports}
          })
          break
        }
      }
      console.log(type,'node',node,e)
      this.dnd.start(node,e)
    },
    //提交
    submit(){
      console.log('this.graph', this.graph.toJSON())
    }
  },
  mounted(){
    this.initGraph()
  }
}
</script>

<style lang="scss" scoped>
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
          .toolDisabeld{
            color: gray;
            cursor: default;
          }
          .toolDefault{
            color: #000;
            cursor: pointer;
          }
        }
      }
      .canvas-title{
        position: absolute;
        top: 90px;
        left: 20px;
        z-index: 2;
      }
    }
    .right-container{
      width: 200px;
      height: 500px;
      background-color: cadetblue;
    }
  }
}
</style>
<style>
/* .x6-cell-tool-editor{
  min-width: 100px !important;
  min-height: 40px !important;
} */
.x6-port-body {
  visibility: hidden;
}
.x6-node-selected .x6-port-body {
  visibility: visible;
}
</style>
