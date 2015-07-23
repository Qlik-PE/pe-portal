define(['qvangular', 'text!./connectdialog.ng.html', 'css!./connectdialog.css'], function (qvangular, template) {
    return {
        template: template,
        controller: ['$scope', 'input', function ($scope, input) {
            function init() {
                $scope.isEdit = input.editMode;
                $scope.id = input.instanceId;
                $scope.connectionParameters = {};
                $scope.localConfigList = [];
                $scope.onlineConfigList = [];
                $scope.selectedConfigSource = "local";
                $scope.step = "config-selection";
                $scope.connectionTemplates = {
                    None: "/customdata/QRestConnector/noAuth.ng.html",
                    Basic: "/customdata/QRestConnector/basicAuth.ng.html",
                    "OAuth 2.0": "",
                    Certificate: "",
                    "API Key": "/customdata/QRestConnector/apiKey.ng.html"
                };
                $scope.name;
                $scope.username;
                $scope.password;
                $scope.url;
                $scope.config;
                $scope.provider = "rest-connector.exe";
                $scope.subpage = $scope.connectionTemplates["None"];

                //if the connection is being modified
                if (input.editMode) {
                    input.serverside.getConnection(input.instanceId).then(function (result) {
                        console.log(result);
                        var tempArray = result.qConnection.qConnectionString.substring(19, result.qConnection.qConnectionString.length-1).split(';');
                        for (var i = 0; i < tempArray.length; i++) {
                            var param = tempArray[i].split('=');
                            $scope.connectionParameters[param[0]] = param[1];
                        }
                        $scope.config = $scope.connectionParameters["config"];
                        $scope.name = result.qConnection.qName;
                        $scope.url = $scope.connectionParameters["url"];
                        $scope.loadTemplate('connection-settings', $scope.config);
                    });
                }

                //getLocalConfigs();


                //get config list
                input.serverside.sendJsonRequest("getLocalConfigs").then(function (response) {
                    $scope.localConfigList = JSON.parse(response.qMessage).configs;
                });
            }

            //build the connection string
            function buildConnectionString() {
                var conn = "CUSTOM CONNECT TO \"provider=rest-connector.exe;config=" + $scope.config + ";";
                $('[data-parameter]').each(function (index, item) {
                    conn += $(item).attr("data-parameter") + "=" + $(item).val() + ";";
                });
                conn += "\"";
                return conn;
            }

            //save the connection
            $scope.onOKClicked = function () {
                if ($scope.isEdit) {
                    input.serverside.modifyConnection($scope.instanceId, $scope.name, buildConnectionString(), true, $scope.username, $scope.password);
                }
                else {
                    input.serverside.createNewConnection($scope.name, buildConnectionString(), $scope.username, $scope.password);
                }
            };

            //close the dialog
            $scope.onCancelClicked = function () {
                if (!$scope.isLoading) {
                    $scope.destroyComponent();
                }
            };

            //display the appropriate step
            $scope.nextStep = function (step) {
                $scope.step = step;
            };

            //load and display the required template based on the config auth setting
            $scope.loadTemplate = function (step, config) {
                this.nextStep(step);
                $scope.config = config;
                input.serverside.sendJsonRequest("getConfigAuth", config).then(function (response) {
                    $scope.subpage = $scope.connectionTemplates[response.qMessage];
                });
            }

            init();
        }]
    };
});