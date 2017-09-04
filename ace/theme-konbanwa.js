define("ace/theme/konbanwa",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-konbanwa";
exports.cssText = ".ace-konbanwa .ace_gutter {\
background: #333;\
color: #C5C8C6\
}\
.ace-konbanwa .ace_print-margin {\
width: 1px;\
background: #25282c\
}\
.ace-konbanwa {\
background-color: #1c1c1c;\
color: #C8C8C8\
}\
.ace-konbanwa .ace_cursor {\
color: #AEAFAD\
}\
.ace-konbanwa .ace_marker-layer .ace_selection {\
background: #373B41\
}\
.ace-konbanwa.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #1D1F21;\
border-radius: 2px\
}\
.ace-konbanwa .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-konbanwa .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #4B4E55\
}\
.ace-konbanwa .ace_marker-layer .ace_active-line {\
background: #1A2B3F\
}\
.ace-konbanwa .ace_gutter-active-line {\
background-color: #3D5363\
}\
.ace-konbanwa .ace_marker-layer .ace_selected-word {\
border: 1px solid #373B41\
}\
.ace-konbanwa .ace_invisible {\
color: #4B4E55\
}\
.ace-konbanwa .ace_keyword,\
.ace-konbanwa .ace_meta,\
.ace-konbanwa .ace_storage,\
.ace-konbanwa .ace_storage.ace_type,\
.ace-konbanwa .ace_support.ace_type {\
color: #B294BB\
}\
.ace-konbanwa .ace_keyword.ace_operator {\
color: #8ABEB7\
}\
.ace-konbanwa .ace_constant.ace_character,\
.ace-konbanwa .ace_constant.ace_language,\
.ace-konbanwa .ace_constant.ace_numeric,\
.ace-konbanwa .ace_keyword.ace_other.ace_unit,\
.ace-konbanwa .ace_support.ace_constant,\
.ace-konbanwa .ace_variable.ace_parameter {\
color: #DE935F\
}\
.ace-konbanwa .ace_constant.ace_other {\
color: #CED1CF\
}\
.ace-konbanwa .ace_invalid {\
color: #CED2CF;\
background-color: #DF5F5F\
}\
.ace-konbanwa .ace_invalid.ace_deprecated {\
color: #CED2CF;\
background-color: #B798BF\
}\
.ace-konbanwa .ace_fold {\
background-color: #81A2BE;\
border-color: #C5C8C6\
}\
.ace-konbanwa .ace_entity.ace_name.ace_function,\
.ace-konbanwa .ace_support.ace_function,\
.ace-konbanwa .ace_variable {\
color: #81A2BE\
}\
.ace-konbanwa .ace_support.ace_class,\
.ace-konbanwa .ace_support.ace_type {\
color: #F0C674\
}\
.ace-konbanwa .ace_heading,\
.ace-konbanwa .ace_markup.ace_heading,\
.ace-konbanwa .ace_string {\
color: #B5BD68\
}\
.ace-konbanwa .ace_entity.ace_name.ace_tag,\
.ace-konbanwa .ace_entity.ace_other.ace_attribute-name,\
.ace-konbanwa .ace_meta.ace_tag,\
.ace-konbanwa .ace_string.ace_regexp,\
.ace-konbanwa .ace_variable {\
color: #CC6666\
}\
.ace-konbanwa .ace_comment {\
color: #969896\
}\
.ace-konbanwa .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
