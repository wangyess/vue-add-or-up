;(function () {
    'use strict';
    window.Event = new Vue();

    //...............................................................................商品组件
    Vue.component('product_page', {
        template: '#tpl-product-page',
        props: ['plist','cclist'],
        data: function () {
            return {
                product_list_item: {cat_id:''}
            }
        },
        mounted: function () {
            var me = this;
            Event.$on('up_success', function () {
                me.product_list_item = {cat_id:''};
            });
        },
        methods: {
            trigger: function (name, data) {
                Event.$emit(name, data);
            },
            filler_page: function (data) {
                this.product_list_item = Object.assign({}, data);
            }
        }
    });
    //...............................................................................分类组件
    Vue.component('class_page', {
        template: '#tpl-class-page',
        props: ['clist'],
        data: function () {
            return {
                class_list_item: {parent_id:0}
            }
        },
        mounted: function () {
            var me=this;
            Event.$on('class_success',function () {
                me.class_list_item={parent_id:0};
            })
        },
        methods: {
            trigger_two: function (name, data) {
                Event.$emit(name, data);
            },
            filler_page_two: function (item) {
                this.class_list_item = Object.assign({}, item);
            }
        }

    });
    //...................................................................................实例
    new Vue({
        el: '#app',
        data: {
            product_list: [],
            product_last_id: 0,
            class_list: [],
            class_last_id: 0,
        },
        mounted: function () {
            this.product_list = s.get('product_list') || [];
            this.product_last_id = s.get('product_last_id') || 0;

            this.class_list = s.get('class_list') || [];
            this.class_last_id = s.get('class_last_id') || 0;

            var me = this;
            Event.$on('add_up', function (data) {
                me.add_or_updata(data);
            });
            Event.$on('to_del', function (data) {
                me.del(data);
            });
            //.......................................................class
            Event.$on('add_up_two', function (data) {
                me.add_or_up_class(data);
            });
            Event.$on('to_del_two', function (data) {
                me.del_two(data);
            });
        },
        methods: {
            add_or_up_class: function (data) {
                if (!data.title || !data) {
                    throw '请正确输入信息!';
                }
                if (data.id) {
                    var de_index = this.find_class_index(data.id);
                    if (de_index === -1) {
                        throw '找不到指定的索引';
                    }
                    this.class_list[de_index] = Object.assign({}, this.class_list[de_index], data)
                } else {
                    data.id = s.get('class_last_id') + 1;
                    this.class_list.push(Object.assign({}, data));
                    this.up_class_last_id();
                }
                Event.$emit('class_success');
            },
            del_two: function (data) {
                var del_index = this.find_class_index(data);
                if (del_index === -1) {
                    throw '没找到删除不了啊!咋办,老大?'
                }
                this.class_list.splice(del_index, 1);
            },
            find_class_index: function (id) {
                return this.class_list.findIndex(function (item) {
                    if (item.id === id) {
                        return true;
                    }
                })
            },

            add_or_updata: function (data) {
                if (!data.title || !data.price || !data) {
                    throw '请正确输入信息!';
                }
                if (data.id) {
                    var up_index = this.find_index(data.id);
                    if (up_index === -1) {
                        throw '找不到指定的索引';
                    }
                    this.product_list[up_index] = Object.assign({}, this.product_list[up_index], data)
                } else {
                    data.id = s.get('product_last_id') + 1;
                    this.product_list.push(Object.assign({}, data));
                    this.up_product_last_id();
                }
                Event.$emit('up_success');
            },
            del: function (data) {
                var del_index = this.find_index(data);
                if (del_index === -1) {
                    throw '没找到删除不了啊!咋办,老大?'
                }
                this.product_list.splice(del_index, 1);
            },
            find_index: function (id) {
                return this.product_list.findIndex(function (item) {
                    if (item.id === id) {
                        return true;
                    }
                })
            },

            //.......................................................................更新函数
            up_product_list: function () {
                s.set('product_list', this.product_list);
            },
            up_product_last_id: function () {
                var last_id = s.get('product_last_id');
                s.set('product_last_id', last_id + 1);
            },

            up_class_list: function () {
                s.set('class_list', this.class_list);
            },
            up_class_last_id: function () {
                var last_id_1 = s.get('class_last_id');
                s.set('class_last_id', last_id_1 + 1);
            }
        },
        //...........................................................................监听函数
        watch: {
            product_list: {
                deep: true,
                handler: function () {
                    this.up_product_list();
                }
            },
            class_list: {
                deep: true,
                handler: function () {
                    this.up_class_list();
                }
            }
        }
    });
})();