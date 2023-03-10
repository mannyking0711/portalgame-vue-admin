<template>
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
        :column-hiding-enabled="true"
    >
        <DxButton
            id="gridDeleteSelected"
            :height="34"
            :disabled="!selectedItemKeys.length"
            text="Delete Selected Records"
            @click="deleteRecords"
        />
        <!-- <DxStateStoring
            :enabled="true"
            type="localStorage"
            storage-key="storage"
        /> -->
        <DxPager
            :show-page-size-selector="true"
            :allowed-page-sizes="[5, 10, 20]"
        />
        <DxGroupPanel :visible="true"/>
        <DxFilterRow :visible="searchVisible"/>
        <DxHeaderFilter :visible="headerFilter"/>
        <DxColumnFixing :enabled="columnFixing"/>
        <DxRowDragging
            :allow-reordering="allowReordering"
            :show-drag-icons="showDragIcons"
            :on-reorder="onReorder"
        />

        <DxEditing
            :allow-updating="editAllowUpdating"
            :allow-deleting="editAllowDeleting"
            :allow-adding="editAllowAdding"
            :mode="editMode"
        />
        <DxPager
            :allowed-page-sizes="[5, 8, 15, 30]"
            :show-info="true"
            :show-navigation-buttons="true"
            :show-page-size-selector="true"
            :visible="true"
        />

        <DxPaging :enabled="allowPaging" :page-size="page.limit"/>
        <DxSelection
            :mode="selectionMode"
            :show-check-boxes-mode="'always'"
        />
        <!-- <DxPager
            :show-page-size-selector="true"
            :allowed-page-sizes="page.size"
            :show-info="true"
        /> -->

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
</template>

<script>
/*
 * Import Components
 * */
import {
    DxGroupPanel,
    // DxStateStoring,
    DxDataGrid,
    DxColumn,
    DxColumnFixing,
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
    DxTotalItem
} from 'devextreme-vue/data-grid';
import {DxButton} from 'devextreme-vue/button';
import UtilDataGridAndDataTree from "../../../plugins/dataGridAndDataTree";

export default {
    name: "StateDataGrid",
    components: {
        DxGroupPanel,
        // DxStateStoring,
        DxDataGrid,
        DxColumn,
        DxColumnFixing,
        DxHeaderFilter,
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
        DxTotalItem
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
        onReorder(e) {
            const visibleRows = e.component.getVisibleRows();
            const toIndex = this.dataSource.indexOf(visibleRows[e.toIndex].data);
            const fromIndex = this.dataSource.indexOf(e.itemData);
            const newDataSource = [...this.dataSource];

            newDataSource.splice(fromIndex, 1);
            newDataSource.splice(toIndex, 0, e.itemData);

            this.dataSource = newDataSource;
        },
    }
}
</script>

<style scoped>
    @import "./DataGrid.css";
</style>
