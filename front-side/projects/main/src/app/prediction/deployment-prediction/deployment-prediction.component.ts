import { Component, OnInit, ElementRef, OnDestroy, ViewChild, AfterViewChecked, AfterViewInit, NgZone } from '@angular/core';
import { fabric } from 'fabric';
import { PredictionFormService } from '../prediction-form.service';
import { FormControl, NonNullableFormBuilder } from '@angular/forms';
import { PaginatorComponent } from '../../general/paginator/paginator.component';
import { BoatColor, BoatColors } from 'projects/main/src/app/common/utilities';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-deployment-prediction',
  template: `
    <div class="w-full h-[80vh] flex flex-col">
      <!--ページネーター-->
      <div class="flex items-center">
        <button
          mat-icon-button
          type="button"
          (click)="appendPrediction()"
        >
          <mat-icon>add</mat-icon>
        </button>
        <app-paginator
          [aggregate]="fg.deploymentPredictions.controls"
          (moved)="pageMoved($event)"
          (beforeMove)="saveCurrentPrediction()"
        ></app-paginator>
      </div>
      <!--内容-->
      <div #parentDeploymentPredictionCanvas class="grow bg-blue-400">
        <canvas 
          id="deploymentPrediction" 
          #deploymentPredictionCanvas
        ></canvas>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class DeploymentPredictionComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {
  //ページャー
  @ViewChild(PaginatorComponent) paginator!: PaginatorComponent;
  //展開予想キャンバスの親要素
  @ViewChild('parentDeploymentPredictionCanvas') parentDeploymentPredictionCanvas!: ElementRef;
  //展開予想キャンバス要素
  @ViewChild('deploymentPredictionCanvas') deploymentPredictionCanvasEmt!: ElementRef;
  //private canvas!: fabric.Canvas;
  private deploymentPredictionCanvas!: DeploymentPredictionCanvas;

  //サイズ変更検知用Subject
  private sizeChanged = new Subject<{ height: number, width: number}>();
  private sizeChanged$ = this.sizeChanged.asObservable();

  constructor(
    private zone: NgZone, 
    public fg: PredictionFormService, 
  ) { }

  ngOnInit(): void {
    //展開予想図が入力されていればそれを描画する。
    setTimeout(() => {
      if (this.fg.deploymentPredictionIndex !== null) {
        this.paginator.moveAt(this.fg.deploymentPredictionIndex, { cancelBeforeMove: true, cancelMoved: false });
      }
    });
  }

  ngAfterViewInit(): void {
    //サイズ変更検知時の処理を登録する。展開予想キャンバスのサイズを設定する。
    this.sizeChanged$.subscribe(size => {
        this.zone.runOutsideAngular(() => {
          this.deploymentPredictionCanvas.drawInitialRacingPool(size.width, size.height);
        });
    });

    //展開予想キャンバスを初期化する。
    this.deploymentPredictionCanvas = new DeploymentPredictionCanvas(this.deploymentPredictionCanvasEmt);
  }

  ngAfterViewChecked(): void {
    //画面のサイズ変更を検知したとき、変更後のサイズをストリームに流す。
    if (
      this.parentDeploymentPredictionCanvas.nativeElement.offsetHeight !== this.deploymentPredictionCanvasEmt.nativeElement.offsetHeight
      ||
      this.parentDeploymentPredictionCanvas.nativeElement.offsetWidth !== this.deploymentPredictionCanvasEmt.nativeElement.offsetWidth
    ) {
      this.sizeChanged.next({
        height: this.parentDeploymentPredictionCanvas.nativeElement.offsetHeight, 
        width: this.parentDeploymentPredictionCanvas.nativeElement.offsetWidth,
      });
    }
  }

  /**
   * 予想追加処理
   */
  appendPrediction() {
    //展開予想を追加する。
    this.fg.deploymentPredictions.push(new FormControl<string | null>(null));
    //ページ末尾に移動する。※追加した予想をカレントにする。
    this.paginator.moveLast();


    //テスト
    this.setWaitPlacementBoat(6);
  }

  /**
   * カレント展開予想保存処理
   * ページャーによるページ移動時、当コンポーネント破棄時に編集中の展開予想を保存することを想定している。
   */
  saveCurrentPrediction() {
    if (this.fg.deploymentPredictionIndex === null) return;

    //現在編集中の展開予想を保存する。
    this.fg.deploymentPredictions.controls[this.fg.deploymentPredictionIndex as number].setValue(JSON.stringify(this.deploymentPredictionCanvas.toJSON()));
  }

  /**
   * ページ移動時処理
   * ページャーによるページ移動時に呼び出されることを想定している。
   * @param movedValue 
   */
  pageMoved(movedValue: { index: number, data: FormControl<string | null> }) {
    this.fg.deploymentPredictionIndex = movedValue.index;

    //一旦キャンバスをクリアする。
    this.deploymentPredictionCanvas.clear();
    //ロードする。
    this.deploymentPredictionCanvas.loadFromJSON(this.fg.deploymentPredictions.controls[this.fg.deploymentPredictionIndex].value || {}, () => {
      /*
      console.log(`競争水面描画`);
      //初期競争水面を描画する。
      this.deploymentPredictionCanvas.drawInitialRacingPool();
      */
    });
    this.deploymentPredictionCanvas.drawInitialRacingPool();
  }

  /**
   * 配置待ちボート設定処理
   * @param boatNo  艇番
   */
  setWaitPlacementBoat(boatNo: number) {
    this.deploymentPredictionCanvas.setWaitPlacementBoat(boatNo);
  }

  ngOnDestroy(): void {
    //コンポーネント破棄時に編集中の展開予想図を保存できると思われる。
    this.saveCurrentPrediction();
  }
}

//展開予想図キャンバス
export class DeploymentPredictionCanvas extends fabric.Canvas {
  //センターラインを描画する際の、始点、終点の位置情報
  //キャンバスの上から1/3の位置で左端から水平に右に2/3の位置まで
  static centerLineLocationRatio = [0, 1/3, 2/3, 1/3];
  //スタートラインを描画する際の、始点、終点の位置情報
  //キャンバスの左端から1/4の位置で上端から1/3の位置から垂直に下端まで
  static startLineLocationRatio = [1/4, 1/3, 1/4, 1];


  //キャンバスのサイズ
  private canvasHeight = 0;
  private canvasWidth = 0;

  //描画追加待ちボート
  private waitPlacementBoat: number | null = null;

  constructor (
    canvasElement: ElementRef
  ) {
    super(canvasElement.nativeElement, {
      selection: true,
      stateful: true
    });

    //イベント登録処理を行う。
    this.atacheEvents();
  }

  //配置待ちボート設定処理
  setWaitPlacementBoat(boatNo: number) {
    this.waitPlacementBoat = boatNo;
  }

  //配置待ちボートクリア処理
  clearWaitPlacementBoat() {
    this.waitPlacementBoat = null;
  }

  override toJSON() {
    //オーバーライド
    //必要なプロパティを引数に指定。
    return super.toJSON(['lockScalingX', 'lockScalingY', 'cornerColor']);
  }

  //イベント登録処理
  //コンストラクタから一度だけ呼び出される。
  private atacheEvents() {
    //マウスダウンイベント
    this.on('mouse:down', option => {
      if (this.waitPlacementBoat===null) {
        //追加まちボートが選択されていなければ抜ける。
        return;
      }

      //ボートの高さ、キャンバスの高さから割合で導く。
      const boatWidth = Math.floor(this.canvasHeight / 30);
      //ボートの規格より 幅133.6cm、全長289.5cmから2.17を算出。
      const boatHeight = Math.floor(boatWidth * 2.17);

      const boat = new Boat(
        this.waitPlacementBoat,
        option?.pointer?.y || 0,
        option?.pointer?.x || 0,
        boatWidth,
        boatHeight
      );

      this.add(boat);

      //描画追加待ちをオフにする。
      this.waitPlacementBoat = null;
    });
  }

  //水面描画 センターライン、スタートライン、ターンマークを描画する。
  drawInitialRacingPool(): void;
  drawInitialRacingPool(width: number, height: number): void;
  drawInitialRacingPool(width?: number, height?: number) {
    //センターラインを描画する際の、始点、終点の位置情報
    //キャンバスの上から1/3の位置で左端から水平に右に2/3の位置まで
    //const centerLineLocationRatio = [0, 1/3, 2/3, 1/3];

    //スタートラインを描画する際の、始点、終点の位置情報
    //キャンバスの左端から1/4の位置で上端から1/3の位置から垂直に下端まで
    //const startLineLocationRatio = [1/4, 1/3, 1/4, 1];

    //サイズ更新
    if (width && height) {
      this.canvasHeight = height;
      this.canvasWidth = width;

      //キャンバスのサイズを設定する。
      this.setDimensions({
        width: this.canvasWidth,
        height: this.canvasHeight
      });
    }

    //センターラインのキャンバスオブジェクトを生成する。
    const centerLine = new fabric.Line([
      DeploymentPredictionCanvas.centerLineLocationRatio[0] * this.canvasWidth,
      DeploymentPredictionCanvas.centerLineLocationRatio[1] * this.canvasHeight,
      DeploymentPredictionCanvas.centerLineLocationRatio[2] * this.canvasWidth,
      DeploymentPredictionCanvas.centerLineLocationRatio[3] * this.canvasHeight
    ], {
      strokeWidth: 2,
      stroke: 'white'    ,
      selectable: false,
      excludeFromExport: true
    });

    //スタートラインのキャンバスオブジェクトを生成する。
    const startLine = new fabric.Line([
      DeploymentPredictionCanvas.startLineLocationRatio[0] * this.canvasWidth,
      DeploymentPredictionCanvas.startLineLocationRatio[1] * this.canvasHeight,
      DeploymentPredictionCanvas.startLineLocationRatio[2] * this.canvasWidth,
      DeploymentPredictionCanvas.startLineLocationRatio[3] * this.canvasHeight
    ], {
      strokeWidth: 2,
      stroke: 'white',
      selectable: false,
      excludeFromExport: true, //JOSNシリアライズ対象に含めない
    });

    //ターンマークのキャンバスオブジェクトを生成する。
    const turnMarkRadius = Math.floor(this.canvasHeight * 0.015);

    const turnMark = new fabric.Circle({
      radius: turnMarkRadius,
      fill: 'white',
      top: (DeploymentPredictionCanvas.centerLineLocationRatio[1] * this.canvasHeight - turnMarkRadius),
      left: DeploymentPredictionCanvas.centerLineLocationRatio[2] * this.canvasWidth,
      selectable: false,
      excludeFromExport: true, //JOSNシリアライズ対象に含めない
    });

    this.add(centerLine, startLine, turnMark);
  }
}
//ボート
//ボートを表す三角形
class Boat extends fabric.Triangle {
  constructor(boatNo: number, top: number, left: number, width: number, height: number) {
    const boat = BoatColors.find(boat => boat.boatNo === boatNo) as BoatColor
    ;
    super({
      top, left, width, height,
      angle: 90,
      stroke: 'brack',
      fill: boat.backgroundColor,
      lockScalingX: true,
      lockScalingY: true,
      selectable: true,
      cornerColor: 'black' //選択されたときの色
    });
  }
}