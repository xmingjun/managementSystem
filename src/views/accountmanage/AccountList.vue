<template>
  <el-card class="box-card account-list">
    <div slot="header" class="clearfix">
      <span>账户列表</span>
    </div>

    <div>
      <!-- 表格 -->
      <el-table
        @selection-change="handleSelectionChange"
        :data="tableData"
        ref="accountlistTable"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="account" label="账号" width="120"></el-table-column>
        <el-table-column prop="userGroup" label="用户组" width="140"></el-table-column>
        <el-table-column prop="ctime" label="创建时间" width="200"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="editRow(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <el-dialog title="编辑信息" :visible.sync="dialogFormVisible">
        <el-form style="width:340px" ref="saveEditForm" :model="editForm" :rules="rules">
          <el-form-item label="账号" label-width="120px" prop="account">
            <el-input autocomplete="off" v-model="editForm.account"></el-input>
          </el-form-item>
          <el-form-item label="用户组" label-width="120px">
            <el-select placeholder="请选择用户组" v-model="editForm.userGroup">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通管理员" value="普通管理员"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">保 存</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <div class="block all-pagings">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[3, 5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 批量删除 -->
      <div class="batch-del">
        <el-button type="danger" @click="delSelect">批量删除</el-button>
        <el-button type="primary" @click="cancelSelect">取消选择</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import moment from "moment";
import {
  accountList,
  accountDel,
  accountBatchdel,
  accountEdit
} from "@/api/account";

export default {
  data() {
    /* 验证编辑框的账号 */
    const sureAcc = (rule, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空"));
      } else if (value.trim().length < 2 || value.trim().length > 6) {
        callback(new Error("账号在2-6位,且不能有空格"));
      } else {
        callback();
      }
    };
    return {
      /* 表格数据 */
      tableData: [],
      /* 分页数据 */
      currentPage: 1,
      pageSize: 5,
      total: 0,
      /* 批量删除给的id */
      ids: [],
      /* 模态框数据 */
      dialogFormVisible: false,
      isEdit: true, //判断是否作编辑的标杆
      editForm: {
        account: "",
        userGroup: ""
      },
      rules: {
        account: [{ validator: sureAcc, trigger: "blur" }]
      }
    };
  },
  methods: {
    //取消选择框
    cancelSelect() {
      this.$refs.accountlistTable.clearSelection();
    },
    //获取账号列表
    async getAccountList() {
      let { total, data } = await accountList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      //初始化创建时间
      data.forEach(
        v => (v.ctime = moment(v.ctime).format("YYYY-MM-DD hh:mm:ss"))
      );

      // 分别给total和data赋值
      this.total = total;
      this.tableData = data;
    },
    //当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccountList();
    },
    //每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccountList();
    },
    //点击删除按钮
    delRow({ id }) {
      this.$confirm("此操作将永久删除该用户,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          let { code } = await accountDel({ id });
          if (code === 0) {
            //重新刷新页面 (重新请求账号列表)
            this.getAccountList();
          }
        })
        .catch(() => {});
    },
    //选中状态改变时触发
    handleSelectionChange(val) {
      console.log(val);
      this.ids = val.map(item => item.id);
      console.log(this.ids);
    },
    //批量删除
    delSelect() {
      //根据this.ids删除
      // 判断this.ids不为空才发请求
      if (!this.ids.length) {
        return;
      }

      this.$confirm("此操作将永久删除这些用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          let { code } = await accountBatchdel({
            ids: JSON.stringify(this.ids)
          });
          if (code === 0) {
            this.getAccountList();
          }
        })
        .catch(() => {});
    },
    //编辑行
    editRow(row) {
      // console.log(row);
      this.editForm = { ...row }; //把这行的数据赋值给编辑表单
      this.dialogFormVisible = true;
      //把数据存到本地，方便作是否编辑的判断
      localStorage.setItem("oneRow", JSON.stringify(this.editForm));
    },
    //保存编辑
    saveEdit() {
      //判断保存前后的值是否有改变，如果没有，就不发请求
      let localEdit = JSON.parse(localStorage.getItem("oneRow"));
      if (
        this.editForm.account === localEdit.account &&
        this.editForm.userGroup === localEdit.userGroup
      ) {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }

      if (this.isEdit) {
        this.$refs.saveEditForm.validate(async valid => {
          if (valid) {
            let { id, account, userGroup } = this.editForm; //获取参数 --- 在编辑行的函数里已经把值赋给editForm
            let { code } = await accountEdit({ id, account, userGroup });
            if (code === 0) {
              this.getAccountList();
            }
            // 关闭模态框
            this.dialogFormVisible = false;
          } else {
            return false;
          }
        });
      } else {
        this.dialogFormVisible = false;
      }
    }
  },
  created() {
    this.getAccountList();
  },
  beforeUpdate() {
    //解决最后一页删完，不会自动跳到上一页的bug
    if (!this.tableData.length && this.currentPage !== 1) {
      this.currentPage--;
      this.getAccountList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });
    }
  }
};
</script>

<style lang="less">
.account-list {
  .all-pagings {
    margin-top: 20px;
  }
  .batch-del {
    margin-top: 20px;
  }
}
</style>