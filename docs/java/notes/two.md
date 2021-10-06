### Axis调用WebServices

#### 1.服务端

> **config.wsdd文件配置**

```wsdd
 </service>
  <service name="SLServiceInlet" provider="java:RPC">
  <parameter name="allowedMethods" value="*"/>
  <parameter name="className" value="com.ese.SLServiceInlet"/>  //表示服务端对应类
 </service>

```

> **web.xml**

```xml
 <servlet-mapping>
    <servlet-name>AxisServlet</servlet-name>
    <url-pattern>/servlet/AxisServlet</url-pattern>
  </servlet-mapping>

  <servlet-mapping>
    <servlet-name>AxisServlet</servlet-name>
    <url-pattern>*.jws</url-pattern>
  </servlet-mapping>

  <servlet-mapping>
    <servlet-name>AxisServlet</servlet-name>
    <url-pattern>/services/*</url-pattern>
  </servlet-mapping>

```

启动项目发布接口,访问：

http://localhost:8080/services/SLServiceInlet?wsdl

出现xml报文信息，则访问成功

### 2.通过wsdl生成客户端

> **下载axis-src-1_4**

解压axis-src-1_4，在同级创建axis.bat，内容如下：

```shell
set axis_lib=C:\downApp\webservice\axis-src-1_4\axis-1_4\lib
set java_cmd=java -Djava.ext.dirs=%axis_lib%
set axis_servlet=http://localhost:8080/services/SLServiceInlet?wsdl
%java_cmd% org.apache.axis.wsdl.WSDL2Java -u %axis_servlet%
```

执行完成会在同级目录生成客户端Java类