<template>
<div>
    <DxDataGrid
        ref="dataGrid"
        :class="tableClass"
        width="100%"
        :height="height"
        :data-source="dataSource"
        :show-column-lines="showColumnLines"
        :show-row-lines="showRowLines"
        :show-borders="showBorders"
        :row-alternation-enabled="rowAlternationEnabled"
        :column-auto-width="columnAutoWidth"
        :word-wrap-enabled="wordWrapEnabled"
        :remote-operations="remoteOperations"
        
        
        @editing-start="logEvent('EditingStart')"
        @init-new-row="logEvent('InitNewRow')"
        @row-inserting="logEvent('RowInserting')"
        @row-inserted="logEvent('RowInserted')"
        @row-updating="logEvent('RowUpdating')"
        @row-updated="logEvent('RowUpdated')"
        @row-removing="logEvent('RowRemoving')"
        @row-removed="logEvent('RowRemoved')"
        @saving="logEvent('Saving')"
        @saved="logEvent('Saved')"
        @edit-canceling="logEvent('EditCanceling')"
        @edit-canceled="logEvent('EditCanceled')"
        
        :select-text-on-edit-start="selectTextOnEditStart"
        :start-edit-action="startEditAction"

        :selected-row-keys="selectedRowKeys"
        :key-expr="keyExpr"
        @row-prepared="rowPrepared"
        @row-click="rowClick"
        @selection-changed="selectionChanged"
        
    >

    <!-- @editing-start="editingStart"
        @init-new-row="initNewRow"
        @row-inserting="rowInserting"
        @row-inserted="rowInserted"
        @row-updating="rowUpdating"
        @row-updated="rowUpdated"
        @row-removing="rowRemoving"
        @row-removed="rowRemoved"
        @saving="saving"
        @saved="saved"
        @edit-canceling="editCanceling"
        @edit-canceled="editCanceled"-->

        
        <DxButton
            id="gridDeleteSelected"
            :height="34"
            :disabled="!selectedItemKeys.length"
            text="Delete Selected Records"
            @click="deleteRecords"
        />
        <DxFilterRow :visible="searchVisible"/>
        <DxHeaderFilter :visible="headerFilter"/>
        <DxColumnFixing :enabled="columnFixing"/>
        <DxRowDragging
            :allow-reordering="allowReordering"
            :show-drag-icons="showDragIcons"
            :on-reorder="onReorder"
        />

        <DxEditing
            :allow-updating="true"
            :allow-deleting="true"
            :allow-adding="true"
            :mode="row"
        />
        <DxRowDragging
            :allow-reordering="true"
            :on-reorder="onReorder"
            :show-drag-icons="true"
        />
        <DxPaging :enabled="allowPaging" :page-size="page.limit"/>
        <DxSelection
            :mode="selectionMode"
            :show-check-boxes-mode="'always'"
        />
        <DxPager
            :show-page-size-selector="true"
            :allowed-page-sizes="page.size"
            :show-info="true"
        />

        <DxColumn
            :data-field="item.dataField"
            :caption="translate(item.caption)"
            :customize-text="item.customizeText"
            :calculate-cell-value="item.calculateCellValue"
            :true-text="item.trueText"
            :false-text="item.falseText"
            :allowEditing="item.allowEditing"
            :allowFiltering="item.allowFiltering"
            :allow-fixing="item.allowFixing"
            :width="item.width ? item.width : null"
            :alignment="item.alignment ? item.alignment : null"
            :allow-sorting="allowSorting"
            :cell-template="item.slot"
            :headerCellRender="headerCellRender"
            :key="itemIndex+'_'+Math.random()"
            v-for="(item, itemIndex) in columns"

        >
        <!-- v-if="columns.length > 0 && item.show" -->

            <DxFormat v-if="item.formatType" :type="item.formatType" :precision="item.formatPrecision"/>
        </DxColumn>

        <template #[itemTemplate(item)]="{data}" v-for="(item) in columns">
            <slot :name="item.slot" :row="data.data"></slot>
        </template>


        <DxColumn
            v-if="actionColumn"
            css-class="action-td"
            :allow-filtering="false"
            :allow-editing="false"
            :allow-sorting="false"
            data-field="action"
            alignment="center"
            :caption="translate(actionColumnText)"
            :width="actionColumnWidth ? actionColumnWidth : null"
            cell-template="ActionTemplate"
        />
        <template #ActionTemplate="{data}">
            <slot name="actionSlot" :row="data.data"></slot>
        </template>

        <DxSummary v-if="totalColumns.length">
            <DxTotalItem
                v-for="(i, index) in totalColumns"
                :key="'dataGridSummary' + Math.random() + index"
                :column="i.column"
                :summary-type="i.type"
                :customize-text="i.customizeText"
            />
        </DxSummary>

    </DxDataGrid>

    <!-- <DxDataGrid
      :data-source="dataSource"
      key-expr="id"
      :show-borders="true"
      :height="440"
      :row-alternation-enabled="rowAlternationEnabled"
        :column-auto-width="columnAutoWidth"
        :word-wrap-enabled="wordWrapEnabled"
        :remote-operations="remoteOperations"
        @editing-start="editingStart"
        @init-new-row="initNewRow"
        @row-inserting="rowInserting"
        @row-inserted="rowInserted"
        @row-updating="rowUpdating"
        @row-updated="rowUpdated"
        @row-removing="rowRemoving"
        @row-removed="rowRemoved"
        @saving="saving"
        @saved="saved"
        @edit-canceling="editCanceling"
        @edit-canceled="editCanceled"
        :selected-row-keys="selectedRowKeys"
        :key-expr="keyExpr"
        @row-prepared="rowPrepared"
        @row-click="rowClick"
        @selection-changed="selectionChanged"
    >
      <DxRowDragging
        :allow-reordering="true"
        :on-reorder="onReorder"
        :show-drag-icons="showDragIcons"
      />
      <DxFilterRow :visible="searchVisible"/>
      <DxHeaderFilter :visible="headerFilter"/>
      <DxSorting mode="none"/>
      
      <DxScrolling mode="virtual"/>
      <DxColumn
        :width="55"
        data-field="id"
      />
      
      
      <DxColumn
            v-if="actionColumn"
            css-class="action-td"
            :allow-filtering="false"
            :allow-editing="false"
            :allow-sorting="false"
            data-field="action"
            alignment="center"
            :caption="translate(actionColumnText)"
            :width="actionColumnWidth ? actionColumnWidth : null"
            cell-template="ActionTemplate"
        />

    </DxDataGrid>


    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="showDragIcons"
          text="Show Drag Icons"
        />
      </div>
    </div>
      -->

      <div id="events">
      <div>
        <div class="caption">
          Fired events
        </div>
      </div>
      <ul>
        <li
          v-for="(event, index) in events"
          :key="index"
        >{{ event }}</li>
      </ul>
    </div>
    </div>
</template>

<script>
/*
 * Import Components
 * */
import {
    DxDataGrid,
    DxColumn,
    DxColumnFixing,
    // DxLookup,
    DxHeaderFilter,
    DxFilterRow,
    DxEditing,
    DxPaging,
    DxPager,
    // DxFilterPanel,
    // DxFilterBuilderPopup,
    // DxScrolling,
    DxSelection,
    DxRowDragging,
    DxFormat,
    DxSummary,
    DxTotalItem,
} from 'devextreme-vue/data-grid';
import {DxButton} from 'devextreme-vue/button';
import UtilDataGridAndDataTree from "../../../plugins/dataGridAndDataTree";

import CustomStore from 'devextreme/data/custom_store';

const store = new CustomStore({
    // ...
    update: (values) => {
        
        console.log(values);
        // this.dataSource.store().save(values);
    }
});

export default {
    name: "DraggableDataGrid",
    components: {
        DxDataGrid,
        DxColumn,
        DxColumnFixing,
        DxHeaderFilter,
        // DxLookup,
        DxFilterRow,
        DxRowDragging,
        DxEditing,
        DxPaging,
        DxPager,
        // DxFilterPanel,
        // DxFilterBuilderPopup,
        // DxScrolling,
        DxButton,
        DxSelection,
        DxFormat,
        DxSummary,
        DxTotalItem,
    },
    props: {
        ...UtilDataGridAndDataTree.props
    },
    data() {
        return {
            item: {},
            tasks: [],
            page: {
                limit: 20,
                size: [20, 50, 100, 150]
            },
            selectedItemKeys: [],
        }
    },
    computed: {
        dxInstance() {
            return this.$refs['dataGrid'].instance;
        }
    },
    created() {
        const self = this;
        if (self.pageLimit)
            self.page.limit = self.pageLimit;
        if (self.pageSize)
            self.page.size = self.pageSize;
    },
    methods: {
        ...UtilDataGridAndDataTree.methods,
        onRowPrepared(data) {
            console.log(data);
        },
        deleteRecords: () => {
            this.selectedItemKeys.forEach((key) => {
                this.dataSource.store().remove(key);
            });
            this.selectedItemKeys = [];
            this.dataSource.reload();
        },
        selectionChanged(data) {
            this.selectedItemKeys = data.selectedRowKeys;
        },
        logEvent(eventName) {
            this.events.unshift(eventName);
        },  
        // onReorder(e) {
        //     const toArr = [];
        //     for (let population in e) {
        //         if (e.hasOwnProperty(population)) {
        //             toArr.push(population)
        //         }
        //     }

            

        //     let toIn = Number(e.toIndex);
        //     // alert(this.dataSource);
        //     const visibleRows = e.component.getVisibleRows();
        //     // console.log(this.dataSource);
        //     // Object.values(this.dataSource);
        //     // alert(visibleRows[toIn]);
        //     // alert(e.itemData);
        //     // Array.from(e);
        //     // alert(Array.from(e));
            
        //     const toIndex = this.dataSource.toString().indexOf(visibleRows[toIn].data);
        //     const fromIndex = this.dataSource.toString().indexOf(toArr.itemData);
        //     const newDataSource = [...this.dataSource];

        //     newDataSource.splice(fromIndex, 1);
        //     newDataSource.splice(toIndex, 0, e.itemData);

        //     this.dataSource = newDataSource;
        // },
        onReorder(e) {
            const visibleRows = e.component.getVisibleRows();
            const toIndex = this.dataSource.findIndex((item) => item.position === visibleRows[e.toIndex].data.position);
            const fromIndex = this.dataSource.findIndex((item) => item.position === e.itemData.position);
            const newTasks = [...this.dataSource];

            newTasks.splice(fromIndex, 1);
            newTasks.splice(toIndex, 0, e.itemData);

            this.tasks = newTasks;
        },
    }
     
}

</script>

<style scoped>
    @import "./DataGrid.css";
</style>
