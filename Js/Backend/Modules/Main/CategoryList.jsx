import React from 'react';
import Webiny from 'webiny';
import CategoryModal from './CategoryModal';
import ArticleList from './ArticleList';

/**
 * @i18n.namespace FAQ.Backend.Main.CategoryList
 */
class CategoryList extends Webiny.Ui.View {

}

CategoryList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/faq/category',
            fields: '*,createdBy[firstName,lastName],articles.id,articles.createdBy[firstName,lastName],articles.question,articles.answer,articles.createdOn,articles.published',
            perPage: 100,
            sort: '-createdOn',
            layout: null
        };

        const confirmDelete = {
            label: this.i18n('Delete'),
            title: this.i18n('Delete confirmation'),
            icon: 'icon-cancel',
            message: this.i18n('Are you sure you want to delete this record?'),
            onConfirm: ({data}) => {
                const api = new Webiny.Api.Endpoint('/entities/faq/category');
                return api.delete('/' + data.id);
            }
        };

        const articleConfirmDelete = {
            label: this.i18n('Delete'),
            title: this.i18n('Delete confirmation'),
            icon: 'icon-cancel',
            message: this.i18n('Are you sure you want to delete this record?'),
            onConfirm: ({data}) => {
                const api = new Webiny.Api.Endpoint('/entities/faq/article');
                return api.delete('/' + data.id);
            }
        };

        const modules = ['ViewSwitcher', 'View', 'Link', 'Icon', 'List', 'Grid', 'ExpandableList', 'Filters', 'Dropdown', 'Modal'];

        return (
            <Webiny.Ui.LazyLoad modules={modules}>
                {(Ui) => (
                    <Ui.ViewSwitcher>
                        <Ui.ViewSwitcher.View view="categoryListView" defaultView>
                            {({showView}) => (
                                <view>
                                    <Ui.View.List>
                                        <Ui.View.Header
                                            title={this.i18n('FAQ Articles')}
                                            description={this.i18n('List of your FAQ categories. Click on a category to show the questions.')}>
                                            <Ui.Link type="primary" align="right" onClick={() => showView('categoryModalView')()}>
                                                <Ui.Icon icon="icon-plus-circled"/>
                                                {this.i18n('Create new Category')}
                                            </Ui.Link>
                                        </Ui.View.Header>
                                        <Ui.View.Body>
                                            <Ui.List {...listProps}>
                                                {({list}) => {
                                                    return (
                                                        <Ui.Grid.Row>
                                                            <Ui.Grid.Col all={12}>
                                                                <Ui.List.Loader/>
                                                                <Ui.List.Table.Empty renderIf={!list.length}/>
                                                                <Ui.ExpandableList>
                                                                    {list.map(row => {
                                                                        return (
                                                                            <Ui.ExpandableList.Row key={row.id}>
                                                                                <Ui.ExpandableList.Field width={4}>
                                                                                    {row.title}
                                                                                </Ui.ExpandableList.Field>
                                                                                <Ui.ExpandableList.Field
                                                                                    width={2}
                                                                                    className="text-center">
                                                                                    {(row.published === true ? this.i18n('Yes') : this.i18n('No'))}
                                                                                </Ui.ExpandableList.Field>
                                                                                <Ui.ExpandableList.Field width={2}>
                                                                                    {row.createdBy.firstName} {row.createdBy.lastName}
                                                                                </Ui.ExpandableList.Field>
                                                                                <Ui.ExpandableList.Field width={2}>
                                                                                    <Ui.Filters.DateTime value={row.createdOn}/>
                                                                                </Ui.ExpandableList.Field>
                                                                                <Ui.ExpandableList.Field
                                                                                    width={2}
                                                                                    className="text-center">
                                                                                <span className="badge badge-default">
                                                                                    {row.articles.length}
                                                                                </span>
                                                                                </Ui.ExpandableList.Field>
                                                                                <Ui.ExpandableList.RowDetailsList title={row.title}>
                                                                                    <ArticleList data={row} showView={showView}/>
                                                                                </Ui.ExpandableList.RowDetailsList>
                                                                                <Ui.ExpandableList.ActionSet>
                                                                                    <Ui.ExpandableList.Action
                                                                                        label={this.i18n('New Article')}
                                                                                        icon="fa-plus-circle"
                                                                                        onClick={() => Webiny.Router.goToRoute('Faq.Article.Create', {category: row.id})}/>
                                                                                    <Ui.Dropdown.Divider/>
                                                                                    <Ui.ExpandableList.Action
                                                                                        label={this.i18n('Edit')}
                                                                                        icon="icon-pencil"
                                                                                        onClick={() => showView('categoryModalView')(row)}/>
                                                                                    <Ui.ExpandableList.Action
                                                                                        label={this.i18n('Delete')}
                                                                                        icon="icon-cancel"
                                                                                        onClick={() => showView('confirmDelete')(row)}/>
                                                                                </Ui.ExpandableList.ActionSet>
                                                                            </Ui.ExpandableList.Row>
                                                                        );
                                                                    })}
                                                                </Ui.ExpandableList>
                                                            </Ui.Grid.Col>
                                                        </Ui.Grid.Row>
                                                    );
                                                }}

                                            </Ui.List>
                                        </Ui.View.Body>
                                    </Ui.View.List>
                                </view>
                            )}
                        </Ui.ViewSwitcher.View>

                        <Ui.ViewSwitcher.View view="categoryModalView" modal>
                            {params => <CategoryModal {...params}/>}
                        </Ui.ViewSwitcher.View>

                        <Ui.ViewSwitcher.View view="confirmDelete" modal>
                            {({showView, data}) => (
                                <Ui.Modal.Confirmation onComplete={showView('categoryListView')} {...confirmDelete} data={data}/>
                            )}
                        </Ui.ViewSwitcher.View>

                        <Ui.ViewSwitcher.View view="articleConfirmDelete" modal>
                            {({showView, data}) => (
                                <Ui.Modal.Confirmation onComplete={showView('categoryListView')} {...articleConfirmDelete} data={data}/>
                            )}
                        </Ui.ViewSwitcher.View>
                    </Ui.ViewSwitcher>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default CategoryList;