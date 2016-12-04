import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
import CategoryModal from './CategoryModal';
import ArticleList from './ArticleList';

class CategoryList extends Webiny.Ui.View {

}

CategoryList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/faq/category',
            fields: '*, author[firstName,lastName]',
            perPage: 100,
            sort: '-createdOn',
            layout: null
        };

        const confirmDelete = {
            label: 'Delete',
            title: 'Delete confirmation',
            icon: 'icon-cancel',
            message: 'Are you sure you want to delete this record?',
            onConfirm: (e, data) => {
                console.log(data);
                const api = new Webiny.Api.Endpoint('/entities/faq/category');
                return api.delete('/' + data.props.id).then(result => {
                    showView('categoryListView');
                });
            }
        };

        return (
            <Ui.ViewSwitcher.Container>
                <Ui.ViewSwitcher.View view="categoryListView" defaultView>
                    {showView => (
                        <view>
                            <Ui.View.List>
                                <Ui.View.Header title="FAQ Articles">
                                    <Ui.Link type="primary" align="right" onClick={() => showView('categoryModalView')()}>
                                        <Ui.Icon icon="icon-plus-circled"/>
                                        Create new Category
                                    </Ui.Link>
                                </Ui.View.Header>
                                <Ui.View.Body>

                                    <Ui.List {...listProps}>
                                        {(data, meta, errorList) => {
                                            return (
                                                <Ui.Grid.Col all={12}>
                                                    <Ui.List.Loader/>
                                                    <Ui.List.Table.Empty renderIf={!data.length}/>

                                                    <Ui.ExpandableList>
                                                        {data.map(row => {
                                                            return (
                                                                <Ui.ExpandableList.Row key={row.id}>
                                                                    <Ui.ExpandableList.Field all={5}
                                                                                             name="Category">{row.title}</Ui.ExpandableList.Field>
                                                                    <Ui.ExpandableList.Field all={3}
                                                                                             name="Author">{row.author.firstName} {row.author.lastName}</Ui.ExpandableList.Field>
                                                                    <Ui.ExpandableList.Field all={4} name="Created">
                                                                        <Ui.Filters.DateTime value={row.createdOn}/>
                                                                    </Ui.ExpandableList.Field>

                                                                    <Ui.ExpandableList.RowDetailsList title={row.title}>
                                                                        <ArticleList category={row}/>
                                                                    </Ui.ExpandableList.RowDetailsList>

                                                                    <Ui.ExpandableList.ActionSet>
                                                                        <Ui.ExpandableList.Action
                                                                            label="New Question"
                                                                            icon="fa-plus-circle"
                                                                            onClick={() => Webiny.Router.goToRoute('Faq.Article.Create', {category: row.id})}/>

                                                                        <Ui.Dropdown.Divider/>

                                                                        <Ui.ExpandableList.Action
                                                                            label="Edit"
                                                                            icon="icon-pencil"
                                                                            onClick={() => showView('categoryModalView')(row)}/>

                                                                        <Ui.ExpandableList.Action
                                                                            label="Delete"
                                                                            icon="icon-cancel"
                                                                            onClick={() => showView('confirmDelete')(row)}/>
                                                                    </Ui.ExpandableList.ActionSet>

                                                                </Ui.ExpandableList.Row>
                                                            );
                                                        })}
                                                    </Ui.ExpandableList>

                                                </Ui.Grid.Col>

                                            );
                                        }}
                                    </Ui.List>


                                </Ui.View.Body>
                            </Ui.View.List>
                        </view>
                    )}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="categoryModalView" modal>
                    {(showView, data) => <CategoryModal ui="categoryModal" {...{showView, data}} />}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="confirmDelete" modal>
                    {(showView, data) => <Ui.Modal.Confirmation {...confirmDelete} data={data}/>}
                </Ui.ViewSwitcher.View>


            </Ui.ViewSwitcher.Container>
        );
    }
};

export default CategoryList;